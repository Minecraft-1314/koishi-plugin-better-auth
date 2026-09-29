"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSchema = void 0;
const koishi_1 = require("koishi");
const AdminSchema = koishi_1.Schema.object({
    enabled: koishi_1.Schema.boolean().default(true).description('启用管理员账号创建'),
    username: koishi_1.Schema.string().default('admin').description('管理员用户名'),
    password: koishi_1.Schema.string().role('secret').default('').description('管理员密码，留空表示不同步密码'),
}).description('管理员设置');
const SecuritySchema = koishi_1.Schema.object({
    maxLoginAttempts: koishi_1.Schema.natural().default(5).description('最大登录尝试次数，超出后将锁定账号'),
    lockTime: koishi_1.Schema.natural().role('s').default(900).min(60).description('登录锁定时间（秒）'),
    idleTimeout: koishi_1.Schema.natural().role('s').default(1800).min(0).description('空闲超时时间（秒），0 表示不限制'),
    passwordMinLength: koishi_1.Schema.natural().default(6).min(4).description('密码最小长度（修改密码时生效）'),
    passwordRequireSpecialChar: koishi_1.Schema.boolean().default(false).description('密码必须包含特殊字符（修改密码时生效）'),
}).description('安全设置');
const TokenSchema = koishi_1.Schema.object({
    authExpire: koishi_1.Schema.natural().role('s').default(604800).min(60).description('用户令牌有效期（秒）'),
    refreshExpire: koishi_1.Schema.natural().role('s').default(2592000).min(60).description('刷新令牌有效期（秒）'),
    rememberExpire: koishi_1.Schema.natural().role('s').default(2592000).min(60).description('记住我令牌有效期（秒）'),
    maxTokensPerUser: koishi_1.Schema.natural().default(20).min(1).description('每个用户最大令牌数'),
    revokeOnPasswordChange: koishi_1.Schema.boolean().default(true).description('修改密码时撤销该账号的其他登录会话'),
}).description('令牌设置');
const CleanupSchema = koishi_1.Schema.object({
    enabled: koishi_1.Schema.boolean().default(true).description('启用自动数据清理'),
    interval: koishi_1.Schema.natural().role('s').default(3600).min(300).description('清理间隔（秒）'),
    attemptRetention: koishi_1.Schema.natural().role('s').default(86400).description('登录尝试记录保留时间（秒）'),
}).description('数据清理');
const NotificationSchema = koishi_1.Schema.object({
    enabled: koishi_1.Schema.boolean().default(false).description('启用登录提醒'),
    target: koishi_1.Schema.string().default('').description('目标群号'),
    robotId: koishi_1.Schema.string().default('').description('指定机器人账号（留空使用第一个）'),
    loginSuccess: koishi_1.Schema.boolean().default(true).description('登录成功时发送提醒'),
    loginFail: koishi_1.Schema.boolean().default(false).description('登录失败时发送提醒'),
    loginNotifyMessage: koishi_1.Schema.string().default('').description('登录成功提醒模板（留空使用默认）'),
    failNotifyMessage: koishi_1.Schema.string().default('').description('登录失败提醒模板（留空使用默认）'),
}).description('登录提醒');
const DebugSchema = koishi_1.Schema.object({
    enabled: koishi_1.Schema.boolean().default(false).description('启用调试日志（仅输出到日志，不影响前端）'),
    logTokenOps: koishi_1.Schema.boolean().default(false).description('记录令牌操作日志'),
    logLoginAttempts: koishi_1.Schema.boolean().default(false).description('记录登录尝试日志'),
    logNotifications: koishi_1.Schema.boolean().default(false).description('记录通知发送日志'),
    logCleanup: koishi_1.Schema.boolean().default(false).description('记录数据清理日志'),
    logExtensions: koishi_1.Schema.boolean().default(false).description('记录扩展钩子日志'),
}).description('调试设置');
exports.PluginSchema = koishi_1.Schema.object({
    admin: AdminSchema,
    security: SecuritySchema,
    token: TokenSchema,
    cleanup: CleanupSchema,
    notification: NotificationSchema,
    debug: DebugSchema,
}).i18n({
    'zh-CN': require('./locales/zh-CN.json'),
});
