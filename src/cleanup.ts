import { Context } from 'koishi'
import { DebugLogger } from './debug'

export interface CleanupConfig {
  enabled?: boolean
  interval?: number
  attemptRetention?: number
}

export class CleanupService {
  constructor(
    private ctx: Context,
    private config: CleanupConfig,
    private debug: DebugLogger,
  ) {}

  start() {
    if (!this.config.enabled) return
    this.ctx.setInterval(() => this.run(), (this.config.interval ?? 3600) * 1000)
  }

  async run() {
    const attemptKeep = (this.config.attemptRetention ?? 86400) * 1000

    this.debug.cleanup('开始清理过期数据')

    try {
      const now = Date.now()
      const results = await Promise.all([
        this.ctx.database.remove('token', { expiredAt: { $lt: now } }),
        this.ctx.database.remove('refresh_token', { expiredAt: { $lt: now } }),
        this.ctx.database.remove('login_attempt', { createdAt: { $lt: new Date(now - attemptKeep) } }),
      ])
      this.debug.cleanup(`清理完成: 令牌=${results[0]}, 刷新令牌=${results[1]}, 登录尝试=${results[2]}`)
    } catch (e: any) {
      this.ctx.logger.warn('better-auth: 数据清理失败：' + (e?.message || e))
    }
  }
}
