
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

### 管理员设置 (Admin Settings)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `admin.enabled` | boolean | true | 启用管理员账号创建 (Enable admin account creation) |
| `admin.username` | string | admin | 管理员用户名 (Admin username) |
| `admin.password` | string | （必填） | 管理员密码 (Admin password, required) |

### 令牌与超时 (Token & Timeout)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `authTokenExpire` | number | 604800 (7天，秒) | 用户令牌有效期 (User token expiration) |
| `refreshTokenExpire` | number | 2592000 (30天，秒) | 刷新令牌有效期 (Refresh token expiration) |
| `rememberTokenExpire` | number | 2592000 (30天，秒) | 记住我令牌有效期 (Remember me token expiration) |
| `idleTimeout` | number | 1800 (30分钟，秒) | 会话空闲超时时间 (Idle session timeout) |

### 安全与限制 (Security & Limits)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `maxLoginAttempts` | number | 5 | 最大登录尝试次数 (Maximum login attempts) |
| `loginLockTime` | number | 900 (15分钟，秒) | 登录锁定时间 (Login lock time) |

### 登录提醒 (Login Notification)
| 配置项 (Config) | 类型 (Type) | 默认值 (Default) | 说明 (Description) |
|----------------|-------------|-------------------|---------------------|
| `loginNotify.enabled` | boolean | false | 启用登录提醒 (Enable login notification) |
| `loginNotify.target` | string | 空 | 目标群号 (Target group ID) |
| `loginNotify.robotId` | string | 空 | 指定机器人账号，留空自动使用第一个机器人 (Specify bot self ID; leave empty to use the first available bot) |


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
  