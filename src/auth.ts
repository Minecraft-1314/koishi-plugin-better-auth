import { Context, Schema, Service } from 'koishi'
import { Client } from '@koishijs/console'
import { PluginConfig, PluginSchema } from './config'
import { migrateLegacyConfig } from './config'
import { hashPassword } from './password'
import { TokenManager } from './token'
import { LoginHandler } from './login'
import { CleanupService } from './cleanup'
import { LoginNotification } from './notification'
import { DebugLogger } from './debug'
import { ExtensionManager } from './extension'
import { Auth } from './types'
import { resolve } from 'path'

class AuthService extends Service {
  static inject = ['console', 'database']

  static Config: Schema<PluginConfig> = PluginSchema

  public tokenManager: TokenManager
  public loginHandler: LoginHandler
  public cleanup: CleanupService
  public notification: LoginNotification
  public debug: DebugLogger
  public extensions: ExtensionManager

  constructor(ctx: Context, public config: PluginConfig) {
    super(ctx, 'auth')
    this.config = migrateLegacyConfig(config) as PluginConfig

    this.debug = new DebugLogger(config.debug ?? {})
    this.extensions = new ExtensionManager(this.debug)
    this.notification = new LoginNotification(ctx, config.notification ?? {}, this.debug)
    this.tokenManager = new TokenManager(ctx, config.token ?? {}, this.debug, this.extensions)
    this.cleanup = new CleanupService(ctx, config.cleanup ?? {}, this.debug)
    this.loginHandler = new LoginHandler(
      ctx, config.security ?? {}, this.tokenManager,
      this.notification, this.debug, this.extensions,
      this.setAuth.bind(this),
    )

    this.registerModels(ctx)
    this.registerEntry(ctx)
    this.registerListeners(ctx)
  }

  private registerModels(ctx: Context) {
    ctx.model.extend('user', {
      password: 'string(255)',
      config: { type: 'json', length: 65535, initial: null },
      lastLoginAt: 'timestamp',
      failedAttempts: 'unsigned',
      lockedUntil: 'timestamp',
      avatar: 'string(1024)',
      status: 'string(255)',
    })

    ctx.model.extend('token', {
      inc: 'unsigned',
      id: 'unsigned',
      type: 'string(255)',
      token: 'string(255)',
      expiredAt: 'unsigned(8)',
      createdAt: 'timestamp',
      lastUsedAt: 'timestamp',
      userAgent: 'string(255)',
      address: 'string(255)',
      fingerprint: 'string(255)',
      refreshToken: 'string(255)',
    }, { primary: 'inc', autoInc: true, unique: ['token'] })

    ctx.model.extend('refresh_token', {
      inc: 'unsigned',
      id: 'unsigned',
      token: 'string(255)',
      expiredAt: 'unsigned(8)',
      createdAt: 'timestamp',
      revoked: 'boolean',
    }, { primary: 'inc', autoInc: true, unique: ['token'] })

    ctx.model.extend('login_attempt', {
      inc: 'unsigned',
      username: 'string(255)',
      address: 'string(255)',
      fingerprint: 'string(255)',
      success: 'boolean',
      createdAt: 'timestamp',
    }, { primary: 'inc', autoInc: true })
  }

  private registerEntry(ctx: Context) {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  }

  async start() {
    const { enabled, username, password } = this.config.admin ?? {}
    if (!enabled) return
    if (!username || !password) {
      this.ctx.logger.warn('管理员账号创建已启用，但用户名或密码未配置，请检查插件设置')
      return
    }
    this.ctx.logger.info('ensuring admin account')
    await this.ctx.database.upsert('user', [{
      id: 0,
      name: username,
      authority: 5,
      password: hashPassword(password),
      createdAt: new Date(),
    }])
    this.cleanup.start()
  }

  async setAuth(client: Client, auth: Auth | null | undefined = client.auth, passive = false) {
    client.auth = auth ?? undefined
    if (passive) return
    if (auth) {
      const tokens = (await this.ctx.database.get('token', { id: auth.id }))
        .map(({ id, token, refreshToken, ...rest }) => rest)
        .reverse()
      client.send({ type: 'data', body: { key: 'user', value: { ...auth, tokens } } })
    } else {
      client.send({ type: 'data', body: { key: 'user', value: null } })
    }
    client.ctx.emit('console/connection', client)
    client.refresh()
  }

  private registerListeners(ctx: Context) {
    const self = this

    ctx.console.addListener('login/password', async function (name, password, remember = false, deviceFingerprint = '') {
      await self.loginHandler.handlePasswordLogin(this, name, password, remember, deviceFingerprint)
    })

    ctx.console.addListener('login/token', async function (aid, token) {
      await self.loginHandler.handleTokenLogin(this, aid, token)
    })

    ctx.console.addListener('login/refresh', async function (refreshToken) {
      await self.loginHandler.handleRefreshLogin(this, refreshToken)
    })

    ctx.on('console/intercept', async (client, listener) => {
      if (!listener.authority) return false
      if (!client.auth) return true
      if (client.auth.expiredAt <= Date.now()) return true
      if (client.auth.authority < listener.authority) return true

      const idleTimeoutMs = (self.config.security?.idleTimeout ?? 1800) * 1000
      if (idleTimeoutMs > 0 && client.auth.lastUsedAt) {
        const last = new Date(client.auth.lastUsedAt).getTime()
        if (Date.now() - last > idleTimeoutMs) {
          await self.setAuth(client, undefined)
          return true
        }
      }
      return false
    })

    ctx.console.addListener('user/heartbeat', async function () {
      if (!this.auth) return
      const now = new Date()
      await ctx.database.set('token', { token: this.auth.token }, { lastUsedAt: now })
      this.auth.lastUsedAt = now
    })

    ctx.console.addListener('user/delete-token', async function (inc) {
      if (!this.auth) throw new Error('请先登录。')
      const data = await self.tokenManager.revokeOne(inc)
      if (!data) throw new Error('令牌不存在。')
      const [current] = await ctx.database.get('token', { token: this.auth.token })
      if (current && current.inc === inc) {
        await self.setAuth(this, undefined)
      } else {
        await self.setAuth(this)
      }
    })

    ctx.console.addListener('user/delete-tokens', async function (incs: number[]) {
      if (!this.auth) throw new Error('请先登录。')
      if (!incs?.length) return
      const [current] = await ctx.database.get('token', { token: this.auth.token })
      await self.tokenManager.revokeBatch(incs)
      if (current && incs.includes(current.inc)) {
        await self.setAuth(this, undefined)
      } else {
        await self.setAuth(this)
      }
    })

    ctx.console.addListener('user/logout', async function () {
      if (this.auth) {
        const [current] = await ctx.database.get('token', { token: this.auth.token })
        await ctx.database.remove('token', { token: this.auth.token })
        if (current?.refreshToken) {
          await ctx.database.set('refresh_token', { token: current.refreshToken }, { revoked: true })
        }
      }
      await self.setAuth(this, undefined)
    })

    ctx.console.addListener('user/update', async function (data) {
      if (!this.auth) throw new Error('请先登录。')
      if (data.name === '') delete data.name
      if (data.password === '') delete data.password
      if (data.name !== undefined && data.name !== this.auth.name) {
        const [duplicate] = await ctx.database.get('user', { name: data.name })
        if (duplicate && duplicate.id !== this.auth.id) throw new Error('用户名已被占用。')
      }
      if (data.password) data.password = hashPassword(data.password)
      await ctx.database.set('user', { id: this.auth.id }, data)
      const { password, ...safe } = data
      Object.assign(this.auth, safe)
      await self.setAuth(this, undefined, true)
    })

    ctx.console.addListener('config/better-auth/update', async function (data: Record<string, any>) {
      if (!this.auth || this.auth.authority < 5) throw new Error('权限不足。')
      const merged: Record<string, any> = {
        admin: data.admin ?? {},
        security: data.security ?? {},
        token: data.token ?? {},
        cleanup: data.cleanup ?? {},
        notification: data.notification ?? {},
        debug: data.debug ?? {},
      }
      if (!merged.admin.password) delete merged.admin.password
      const mergedConfig = migrateLegacyConfig(merged) as PluginConfig
      self.config = mergedConfig
      self.debug.update(mergedConfig.debug ?? {})
      self.extensions = new ExtensionManager(self.debug)
      self.notification.update(mergedConfig.notification ?? {})
      self.tokenManager.update(mergedConfig.token ?? {})
      self.cleanup.update(mergedConfig.cleanup ?? {})
      self.loginHandler.update(mergedConfig.security ?? {})
      return 'ok'
    })
  }
}

namespace AuthService {
  export const filter = false
}

export default AuthService
