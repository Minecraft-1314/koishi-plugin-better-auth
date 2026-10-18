import { Schema } from 'koishi'
import { CleanupConfig } from './cleanup'
import { DEFAULT_FAIL_NOTIFY_MESSAGE, DEFAULT_LOGIN_NOTIFY_MESSAGE, NotificationConfig } from './notification'
import { DebugConfig } from './debug'

export interface AdminConfig {
  enabled?: boolean
  username?: string
  password?: string
}

export interface TokenConfig {
  authExpire?: number
  refreshExpire?: number
  rememberExpire?: number
}

export interface SecurityConfig {
  maxLoginAttempts?: number
  lockTime?: number
  idleTimeout?: number
  passwordMinLength?: number
  passwordRequireSpecialChar?: boolean
}

export interface TokenManagerConfig extends TokenConfig {
  maxTokensPerUser?: number
  revokeOnPasswordChange?: boolean
}

export interface PluginConfig {
  admin: AdminConfig
  security: SecurityConfig
  token: TokenManagerConfig
  cleanup: CleanupConfig
  notification: NotificationConfig
  debug: DebugConfig
}

export const DEFAULT_ADMIN_USERNAME = 'root'
export const DEFAULT_ADMIN_PASSWORD = '123456'

const AdminSchema = Schema.object({
  enabled: Schema.boolean().default(true).description('启用管理员账号创建'),
  username: Schema.string().default(DEFAULT_ADMIN_USERNAME).description('管理员用户名'),
  password: Schema.string().role('secret').default(DEFAULT_ADMIN_PASSWORD).description('管理员密码，留空表示不同步密码'),
}).description('管理员设置')

const SecuritySchema = Schema.object({
  maxLoginAttempts: Schema.natural().default(5).description('最大登录尝试次数，超出后将锁定账号'),
  lockTime: Schema.natural().role('s').default(900).min(60).description('登录锁定时间（秒）'),
  idleTimeout: Schema.natural().role('s').default(1800).min(0).description('空闲超时时间（秒），0 表示不限制'),
  passwordMinLength: Schema.natural().default(6).min(4).description('密码最小长度（修改密码时生效）'),
  passwordRequireSpecialChar: Schema.boolean().default(false).description('密码必须包含特殊字符（修改密码时生效）'),
}).description('安全设置')

const TokenSchema = Schema.object({
  authExpire: Schema.natural().role('s').default(604800).min(60).description('用户令牌有效期（秒）'),
  refreshExpire: Schema.natural().role('s').default(2592000).min(60).description('刷新令牌有效期（秒）'),
  rememberExpire: Schema.natural().role('s').default(2592000).min(60).description('记住我令牌有效期（秒）'),
  maxTokensPerUser: Schema.natural().default(20).min(1).description('每个用户最大令牌数'),
  revokeOnPasswordChange: Schema.boolean().default(true).description('修改密码时撤销该账号的其他登录会话'),
}).description('令牌设置')

const CleanupSchema = Schema.object({
  enabled: Schema.boolean().default(true).description('启用自动数据清理'),
  interval: Schema.natural().role('s').default(3600).min(300).description('清理间隔（秒）'),
  attemptRetention: Schema.natural().role('s').default(86400).description('登录尝试记录保留时间（秒）'),
}).description('数据清理')

const NotificationSchema = Schema.object({
  enabled: Schema.boolean().default(false).description('启用登录提醒'),
  target: Schema.string().default('').description('目标群号'),
  robotId: Schema.string().default('').description('指定机器人账号（留空使用第一个）'),
  loginSuccess: Schema.boolean().default(true).description('登录成功时发送提醒'),
  loginFail: Schema.boolean().default(false).description('登录失败时发送提醒'),
  loginNotifyMessage: Schema.string().default(DEFAULT_LOGIN_NOTIFY_MESSAGE).description('登录成功提醒模板，支持 {username} {time} {type} {address} 占位符'),
  failNotifyMessage: Schema.string().default(DEFAULT_FAIL_NOTIFY_MESSAGE).description('登录失败提醒模板，支持 {username} {time} {reason} {address} 占位符'),
}).description('登录提醒')

const DebugSchema = Schema.object({
  enabled: Schema.boolean().default(false).description('启用调试日志'),
}).description('调试设置')

export const PluginSchema: Schema<PluginConfig> = Schema.object({
  admin: AdminSchema,
  security: SecuritySchema,
  token: TokenSchema,
  cleanup: CleanupSchema,
  notification: NotificationSchema,
  debug: DebugSchema,
}).i18n({
  'zh-CN': require('./locales/zh-CN.json'),
})
