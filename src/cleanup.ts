import { Context } from 'koishi'
import { DebugLogger } from './debug'

export interface CleanupConfig {
  enabled?: boolean
  interval?: number
  tokenRetention?: number
  refreshTokenRetention?: number
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
    const intervalMs = (this.config.interval ?? 3600) * 1000
    this.ctx.setInterval(() => this.run(), intervalMs)
  }

  update(newConfig: CleanupConfig) {
    this.config = newConfig
  }

  async run() {
    const now = Date.now()
    const attemptKeep = (this.config.attemptRetention ?? 86400) * 1000

    this.debug.cleanup('开始清理过期数据')

    try {
      const results = await Promise.all([
        this.ctx.database.remove('token', { expiredAt: { $lt: now } }),
        this.ctx.database.remove('refresh_token', { expiredAt: { $lt: now } }),
        this.ctx.database.remove('login_attempt', { createdAt: { $lt: new Date(now - attemptKeep) } }),
      ])
      this.debug.cleanup('清理完成: 令牌=' + results[0] + ', 刷新令牌=' + results[1] + ', 登录尝试=' + results[2])
    } catch (e: any) {
      this.ctx.logger.warn('数据清理失败:', e.message || e)
    }
  }
}
