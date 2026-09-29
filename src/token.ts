import { Context } from 'koishi'
import { Client } from '@koishijs/console'
import { randomId } from './password'
import { LoginToken, LoginType, Auth } from './types'
import { TokenManagerConfig } from './config'
import { DebugLogger } from './debug'
import { ExtensionManager } from './extension'

export class TokenManager {
  constructor(
    private ctx: Context,
    private config: TokenManagerConfig,
    private debug: DebugLogger,
    private extensions: ExtensionManager,
  ) {}

  async create(
    client: Client,
    type: LoginType,
    user: { id: number; name: string; authority: number; config: any; avatar?: string; status?: string },
    remember = false,
    deviceFingerprint?: string,
  ) {
    const { headers, socket } = client.request ?? {}
    const createdAt = new Date()
    const lastUsedAt = new Date()
    const userAgent = headers?.['user-agent']?.toString() ?? ''
    const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? ''
    const expireTime = (remember
      ? (this.config.rememberExpire ?? 2592000)
      : (this.config.authExpire ?? 604800)) * 1000
    const expiredAt = Date.now() + expireTime
    const token = randomId()
    const refreshToken = remember ? randomId(60) : undefined

    const tokenData: any = {
      id: user.id,
      type,
      expiredAt,
      token,
      createdAt,
      lastUsedAt,
      userAgent,
      address,
      fingerprint: deviceFingerprint,
    }

    if (refreshToken) {
      const refreshExpire = Date.now() + (this.config.refreshExpire ?? 2592000) * 1000
      await this.ctx.database.create('refresh_token', {
        id: user.id,
        token: refreshToken,
        expiredAt: refreshExpire,
        createdAt,
        revoked: false,
      })
      tokenData.refreshToken = refreshToken
      client.send({ type: 'data', body: { key: 'refreshToken', value: refreshToken } })
    }

    await this.enforceTokenLimit(user.id)
    await this.ctx.database.create('token', tokenData)
    this.debug.token(`创建令牌: 用户=${user.name}, 类型=${type}`)

    await this.extensions.emitTokenCreated({ userId: user.id, token, type })

    return {
      id: user.id,
      name: user.name,
      authority: user.authority,
      config: user.config,
      avatar: user.avatar,
      status: user.status ?? 'active',
      expiredAt,
      token,
      lastUsedAt,
      fingerprint: deviceFingerprint,
    }
  }

  async enforceTokenLimit(userId: number) {
    const maxTokens = this.config.maxTokensPerUser ?? 20
    const tokens = await this.ctx.database.get('token', { id: userId }, { sort: { createdAt: 'asc' as const }, limit: maxTokens + 10 })
    if (tokens.length >= maxTokens) {
      const toRemove = tokens.slice(0, tokens.length - maxTokens + 1)
      for (const t of toRemove) {
        await this.ctx.database.remove('token', { inc: t.inc })
        if (t.refreshToken) {
          await this.ctx.database.set('refresh_token', { token: t.refreshToken }, { revoked: true })
        }
        this.debug.token(`自动移除过期令牌: inc=${t.inc}`)
      }
    }
  }

  async revokeAll(userId: number, exceptToken?: string) {
    const tokens = await this.ctx.database.get('token', { id: userId })
    for (const t of tokens) {
      if (exceptToken && t.token === exceptToken) continue
      if (t.refreshToken) {
        await this.ctx.database.set('refresh_token', { token: t.refreshToken }, { revoked: true })
      }
      await this.ctx.database.remove('token', { inc: t.inc })
      await this.extensions.emitTokenRevoked({ userId, token: t.token })
    }
    this.debug.token(`撤销用户令牌: userId=${userId}${exceptToken ? '（保留当前会话）' : ''}`)
  }

  async revokeOne(inc: number, userId?: number) {
    const [data] = await this.ctx.database.get('token', { inc })
    if (!data || (userId !== undefined && data.id !== userId)) return null
    await this.ctx.database.remove('token', { inc })
    if (data.refreshToken) {
      await this.ctx.database.set('refresh_token', { token: data.refreshToken }, { revoked: true })
    }
    await this.extensions.emitTokenRevoked({ userId: data.id, token: data.token })
    this.debug.token(`撤销令牌: inc=${inc}`)
    return data
  }

  async revokeBatch(incs: number[], userId?: number) {
    const uniqueIncs = [...new Set(incs)]
    const query: Record<string, any> = { inc: { $in: uniqueIncs } }
    if (userId !== undefined) query.id = userId
    const rows = await this.ctx.database.get('token', query)
    if (userId !== undefined && rows.length !== uniqueIncs.length) return null
    await this.ctx.database.remove('token', { inc: { $in: uniqueIncs } })
    for (const row of rows) {
      if (row.refreshToken) {
        await this.ctx.database.set('refresh_token', { token: row.refreshToken }, { revoked: true })
      }
      await this.extensions.emitTokenRevoked({ userId: row.id, token: row.token })
    }
    this.debug.token(`批量撤销令牌: ${rows.length}个`)
    return rows
  }

  async updateLastUsed(token: string) {
    const now = new Date()
    await this.ctx.database.set('token', { token }, { lastUsedAt: now })
    return now
  }
}
