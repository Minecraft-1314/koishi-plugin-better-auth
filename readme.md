
# koishi-plugin-better-auth

## 项目介绍 (Project Introduction)

### 中文
这是一个为 Koishi 机器人框架开发的**控制台用户认证插件**，提供完整的用户登录、令牌管理、会话管理功能。支持密码登录、自动登录、记住我、登录限流、批量移除会话、群聊登录提醒等安全增强特性

### English
This is a **console user authentication plugin** developed for the Koishi bot framework, providing complete user login, token management, and session management. It supports password login, automatic login, remember me, login rate limiting, batch session removal, and group login notification.

## 项目仓库 (Repository)
- GitHub: `https://github.com/Minecraft-1314/koishi-plugin-better-auth`
- Issues: `https://github.com/Minecraft-1314/koishi-plugin-better-auth/issues`


## 配置项说明 (Configuration)

所有配置项均在 Koishi 控制台的**插件配置页**中修改（本插件不再提供独立的用户设置页面）。
配置由控制台按 Schema 校验后写回 `koishi.yml`，保存时本插件会被重新加载，配置立即生效，无需重启机器人。

All settings are edited on the **plugin configuration page** of the Koishi console
(this plugin no longer ships a separate user settings page). Values are validated against
the schema, written back to `koishi.yml`, and applied by reloading the plugin.

### 管理员设置 (`admin`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `enabled` | boolean | true | 启用管理员账号创建 (Enable admin account bootstrap) |
| `username` | string | admin | 管理员用户名，仅在账号不存在时用于创建 (Username, used only when the account is missing) |
| `password` | string | 空 | 管理员密码，留空表示不修改；仅在该值变化时写入数据库，用户自行修改的密码不会被配置保存覆盖 |

### 安全设置 (`security`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `maxLoginAttempts` | number | 5 | 最大登录尝试次数，超出后拒绝登录 (Max failed attempts before lockout) |
| `lockTime` | number | 900 | 登录锁定时间（秒）(Lock duration in seconds) |
| `idleTimeout` | number | 1800 | 空闲超时时间（秒），0 表示不限制 (Idle timeout, 0 disables) |
| `passwordMinLength` | number | 6 | 修改密码时的最小长度 (Minimum length when changing password) |
| `passwordRequireSpecialChar` | boolean | false | 修改密码时必须包含特殊字符 (Require a special character) |

### 令牌设置 (`token`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `authExpire` | number | 604800 | 用户令牌有效期（秒）(User token lifetime) |
| `refreshExpire` | number | 2592000 | 刷新令牌有效期（秒）(Refresh token lifetime) |
| `rememberExpire` | number | 2592000 | 记住我令牌有效期（秒）(Remember-me token lifetime) |
| `maxTokensPerUser` | number | 20 | 每个用户最大令牌数，超出后移除最早的会话 (Max concurrent sessions per user) |
| `revokeOnPasswordChange` | boolean | true | 修改密码时撤销该账号的其他登录会话 (Revoke other sessions on password change) |

### 数据清理 (`cleanup`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `enabled` | boolean | true | 启用自动数据清理 (Enable periodic cleanup) |
| `interval` | number | 3600 | 清理间隔（秒）(Cleanup interval) |
| `attemptRetention` | number | 86400 | 登录尝试记录保留时间（秒）(Login attempt retention) |

### 登录提醒 (`notification`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `enabled` | boolean | false | 启用登录提醒 (Enable login notification) |
| `target` | string | 空 | 目标群号 (Target group ID) |
| `robotId` | string | 空 | 指定机器人账号，留空自动使用第一个机器人 (Bot self ID, first available when empty) |
| `loginSuccess` | boolean | true | 登录成功时发送提醒 (Notify on success) |
| `loginFail` | boolean | false | 登录失败时发送提醒 (Notify on failure) |
| `loginNotifyMessage` | string | 空 | 登录成功提醒模板，留空使用默认 (Success template) |
| `failNotifyMessage` | string | 空 | 登录失败提醒模板，留空使用默认 (Failure template) |

提醒模板支持 `{username}`、`{time}`、`{type}`、`{address}`、`{reason}` 占位符。

### 调试设置 (`debug`)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `enabled` | boolean | false | 调试日志总开关 (Master switch for debug logs) |
| `logTokenOps` | boolean | false | 记录令牌操作 (Token operations) |
| `logLoginAttempts` | boolean | false | 记录登录尝试 (Login attempts) |
| `logNotifications` | boolean | false | 记录提醒发送 (Notifications) |
| `logCleanup` | boolean | false | 记录清理任务 (Cleanup tasks) |
| `logExtensions` | boolean | false | 记录扩展钩子 (Extension hooks) |

### 从旧版本迁移 (Migration from legacy config)

0.0.9 及更早版本使用扁平配置项，且其中多项从未真正生效。若 `koishi.yml` 中仍留有旧字段，
在插件配置页重新填写一次即可，保存后旧字段会被自动清理。

| 旧配置项 (Legacy) | 新配置项 (Current) |
|--------------------|--------------------|
| `adminEnabled` / `adminUsername` / `adminPassword` | `admin.enabled` / `admin.username` / `admin.password` |
| `authTokenExpire` / `refreshTokenExpire` / `rememberTokenExpire` | `token.authExpire` / `token.refreshExpire` / `token.rememberExpire` |
| `loginLockTime` | `security.lockTime` |
| `idleTimeout` / `maxLoginAttempts` | `security.idleTimeout` / `security.maxLoginAttempts` |
| `cleanupEnabled` / `cleanupInterval` / `attemptRetention` | `cleanup.enabled` / `cleanup.interval` / `cleanup.attemptRetention` |
| `loginNotify.*` | `notification.*` |
| `debugEnabled` / `logTokenOps` / ... | `debug.enabled` / `debug.logTokenOps` / ... |

已移除的无效配置项：`passwordHashAlgorithm`（哈希算法固定为 sha256）、
`cleanup.tokenRetention` 与 `cleanup.refreshTokenRetention`
（过期令牌与刷新令牌按 `cleanup.interval` 直接删除，不做延迟保留）。


## 参考项目 (References)

本项目参考了以下开源项目，特此感谢：

- [@koishijs/plugin-auth](https://github.com/koishijs/webui/tree/main/plugins/auth) 

## 项目贡献者 (Contributors)

| 贡献者 (Contributor) | 贡献内容 (Contribution) |
|----------------------|-------------------------|
| Minecraft-1314 | 插件深度定制与功能扩展 |

（欢迎通过 Issues 或 PR 加入贡献者列表）

## 许可协议 (License)

本项目采用 AGPL-3.0 许可证，详情参见 [LICENSE](LICENSE) 文件
This project is licensed under the AGPL-3.0 License, see the [LICENSE](LICENSE) file for details.

## 支持我们 (Support Us)

如果这个项目对您有帮助，欢迎点亮右上角的 Star ⭐ 支持我们！  
If this project is helpful to you, please feel free to star it in the upper right corner ⭐ to support us!
  
