"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginNotification = void 0;
class LoginNotification {
    constructor(ctx, config, debug) {
        this.ctx = ctx;
        this.config = config;
        this.debug = debug;
    }
    update(newConfig) {
        this.config = newConfig;
    }
    async send(message) {
        if (!this.config.enabled || !this.config.target)
            return;
        const target = this.config.target.trim();
        const bots = this.ctx.bots;
        if (!bots.length) {
            this.ctx.logger.warn('未找到可用的机器人，跳过登录提醒发送');
            return;
        }
        let bot = bots[0];
        if (this.config.robotId) {
            const specified = bots.find(b => b.selfId === this.config.robotId);
            if (specified) {
                bot = specified;
            }
            else {
                this.ctx.logger.warn('指定的机器人账号未找到，将使用第一个机器人');
            }
        }
        try {
            await bot.sendMessage(target, message);
            this.debug.notify('登录提醒发送成功');
        }
        catch (e) {
            this.ctx.logger.warn('发送登录提醒失败:', e.message || e);
        }
    }
    async notifyLogin(username, address, type) {
        if (!this.config.loginSuccess)
            return;
        const tpl = this.config.loginNotifyMessage || '用户 {username} 于 {time} {type}控制台，IP: {address}';
        const message = tpl
            .replace('{username}', username)
            .replace('{time}', new Date().toLocaleString())
            .replace('{type}', type)
            .replace('{address}', address);
        await this.send(message);
    }
    async notifyLoginFail(username, address, reason) {
        if (!this.config.loginFail)
            return;
        const tpl = this.config.failNotifyMessage || '用户 {username} 于 {time} 登录失败，原因: {reason}，IP: {address}';
        const message = tpl
            .replace('{username}', username)
            .replace('{time}', new Date().toLocaleString())
            .replace('{reason}', reason)
            .replace('{address}', address);
        await this.send(message);
    }
}
exports.LoginNotification = LoginNotification;
