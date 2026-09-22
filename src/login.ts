import { Context } from 'koishi'
import { hashPassword, verifyPassword } from './password'
import { TokenManager } from './token'
import { SecurityConfig } from './config'
import { DebugLogger } from './debug'
import { LoginNotification } from './notification'
import { ExtensionManager } from './extension'

type SetAuthFn = (client: any, auth: any, passive?: boolean) => Promise<void>

export class LoginHandler {
  constructor(
    private ctx: Context,
    private config: SecurityConfig,
    private tokenManager: TokenManager,
    private notification: LoginNotification,
    private debug: DebugLogger,
    private extensions: ExtensionManager,
    private setAuth: SetAuthFn,
  ) {}

  update(newConfig: SecurityConfig) {
    this.config = newConfig
  }

  async recordAttempt(username: string, address: string, fingerprint: string, success: boolean) {
    await this.ctx.database.create('login_attempt', {
      username,
      address,
      fingerprint,
      success,
      createdAt: new Date(),
    })
    await this.extensions.emitLoginAttempt({ username, address, success })
  }

  async checkLock(username: string) {
    const lockTimeMs = (this.config.lockTime ?? 900) * 1000
    const attempts = await this.ctx.database.get('login_attempt', {
      username,
      success: false,
      createdAt: { $gt: new Date(Date.now() - lockTimeMs) },
    })
    if (attempts.length >= (this.config.maxLoginAttempts ?? 5)) {
      throw new Error('登录尝试次数过多，请稍后再试。')
    }
  }

  async handlePasswordLogin(
    client: any,
    name: string,
    password: string,
    remember: boolean,
    deviceFingerprint: string,
  ) {
    const { headers, socket } = client.request ?? {}
    const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? ''

    await this.checkLock(name)
    const [user] = await this.ctx.database.get('user', { name })

    if (!user || !verifyPassword(password, user.password)) {
      await this.recordAttempt(name, address, deviceFingerprint, false)
      await this.extensions.emitLoginFail({ username: name, address, reason: '用户名或密码错误' })
      await this.notification.notifyLoginFail(name, address, '用户名或密码错误')
      throw new Error('用户名或密码错误。')
    }

    if (user.status === 'disabled' || user.status === 'frozen') {
      await this.recordAttempt(name, address, deviceFingerprint, false)
      await this.extensions.emitLoginFail({ username: name, address, reason: '账号已被禁用或冻结' })
      throw new Error('账号已被禁用或冻结。')
    }

    if (user.password && !user.password.includes(':')) {
      await this.ctx.database.set('user', { id: user.id }, { password: hashPassword(password) })
    }

    await this.ctx.database.remove('login_attempt', { username: name })
    await this.recordAttempt(name, address, deviceFingerprint, true)

    const authData = await this.tokenManager.create(client, 'password', {
      id: user.id,
      name: user.name,
      authority: user.authority,
      config: user.config,
      avatar: user.avatar,
      status: user.status ?? 'active',
    }, remember, deviceFingerprint)

    await this.setAuth(client, authData)
    await this.notification.notifyLogin(name, address, '密码登录')
    await this.extensions.emitLoginSuccess({ userId: user.id, username: user.name, type: 'password' })

    this.debug.login('密码登录成功: ' + name + ', IP: ' + address)
  }

  async handleTokenLogin(client: any, aid: number, token: string) {
    const [data] = await this.ctx.database.get('token', { id: aid, token })
    if (!data || data.expiredAt <= Date.now()) throw new Error('令牌已失效。')

    const [user] = await this.ctx.database.get('user', { id: aid })
    if (!user) throw new Error('用户不存在。')
    if (user.status === 'disabled' || user.status === 'frozen') throw new Error('账号已被禁用或冻结。')

    const { headers, socket } = client.request ?? {}
    const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? ''

    const now = await this.tokenManager.updateLastUsed(token)

    await this.setAuth(client, {
      id: user.id,
      name: user.name,
      authority: user.authority,
      config: user.config,
      avatar: user.avatar,
      status: user.status ?? 'active',
      expiredAt: data.expiredAt,
      token,
      lastUsedAt: now,
      fingerprint: data.fingerprint,
    })

    await this.notification.notifyLogin(user.name, address, '自动登录')
    await this.extensions.emitLoginSuccess({ userId: user.id, username: user.name, type: 'token' })

    this.debug.login('令牌登录成功: ' + user.name + ', IP: ' + address)
  }

  async handleRefreshLogin(client: any, refreshToken: string) {
    const [data] = await this.ctx.database.get('refresh_token', { token: refreshToken })
    if (!data || data.expiredAt <= Date.now() || data.revoked) throw new Error('刷新令牌无效。')

    const [user] = await this.ctx.database.get('user', { id: data.id })
    if (!user) throw new Error('用户不存在。')
    if (user.status === 'disabled' || user.status === 'frozen') throw new Error('账号已被禁用或冻结。')

    await this.ctx.database.set('refresh_token', { token: refreshToken }, { revoked: true })
    const authData = await this.tokenManager.create(client, 'token', user, true)
    await this.setAuth(client, authData)

    this.debug.login('刷新令牌登录成功: ' + user.name)
  }
}
