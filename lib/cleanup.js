"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
class CleanupService {
    constructor(ctx, config, debug) {
        this.ctx = ctx;
        this.config = config;
        this.debug = debug;
    }
    start() {
        if (!this.config.enabled)
            return;
        const intervalMs = (this.config.interval ?? 3600) * 1000;
        this.ctx.setInterval(() => this.run(), intervalMs);
    }
    update(newConfig) {
        this.config = newConfig;
    }
    async run() {
        const now = Date.now();
        const attemptKeep = (this.config.attemptRetention ?? 86400) * 1000;
        this.debug.cleanup('开始清理过期数据');
        try {
            const results = await Promise.all([
                this.ctx.database.remove('token', { expiredAt: { $lt: now } }),
                this.ctx.database.remove('refresh_token', { expiredAt: { $lt: now } }),
                this.ctx.database.remove('login_attempt', { createdAt: { $lt: new Date(now - attemptKeep) } }),
            ]);
            this.debug.cleanup('清理完成: 令牌=' + results[0] + ', 刷新令牌=' + results[1] + ', 登录尝试=' + results[2]);
        }
        catch (e) {
            this.ctx.logger.warn('数据清理失败:', e.message || e);
        }
    }
}
exports.CleanupService = CleanupService;
