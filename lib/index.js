"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomId = randomId;
const koishi_1 = require("koishi");
const crypto_1 = require("crypto");
const path_1 = require("path");
function randomId(length = 40) {
    const bytes = Math.ceil(length * 3 / 4);
    return (0, crypto_1.randomBytes)(bytes).toString('base64url').slice(0, length);
}
function hashPassword(password) {
    const salt = randomId(16);
    const digest = (0, crypto_1.createHash)('sha256').update(salt + password).digest('hex');
    return `${salt}:${digest}`;
}
function safeEqual(a, b) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && (0, crypto_1.timingSafeEqual)(left, right);
}
function verifyPassword(plain, hashed) {
    if (!hashed)
        return false;
    const index = hashed.indexOf(':');
    const digest = index >= 0
        ? (0, crypto_1.createHash)('sha256').update(hashed.slice(0, index) + plain).digest('hex')
        : (0, crypto_1.createHash)('sha256').update(plain).digest('hex');
    return safeEqual(digest, index >= 0 ? hashed.slice(index + 1) : hashed);
}
class AuthService extends koishi_1.Service {
    constructor(ctx, config) {
        super(ctx, 'auth');
        this.config = config;
        ctx.model.extend('user', {
            password: 'string(255)',
            config: { type: 'json', length: 65535, initial: null },
            lastLoginAt: 'timestamp',
            failedAttempts: 'unsigned',
            lockedUntil: 'timestamp',
            avatar: 'string(1024)',
            status: 'string(255)',
        });
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
        }, { primary: 'inc', autoInc: true, unique: ['token'] });
        ctx.model.extend('refresh_token', {
            inc: 'unsigned',
            id: 'unsigned',
            token: 'string(255)',
            expiredAt: 'unsigned(8)',
            createdAt: 'timestamp',
            revoked: 'boolean',
        }, { primary: 'inc', autoInc: true, unique: ['token'] });
        ctx.model.extend('login_attempt', {
            inc: 'unsigned',
            username: 'string(255)',
            address: 'string(255)',
            fingerprint: 'string(255)',
            success: 'boolean',
            createdAt: 'timestamp',
        }, { primary: 'inc', autoInc: true });
        ctx.console.addEntry({
            dev: (0, path_1.resolve)(__dirname, '../client/index.ts'),
            prod: (0, path_1.resolve)(__dirname, '../dist'),
        });
        this.initLogin();
    }
    async start() {
        const { enabled, username, password } = this.config.admin ?? {};
        if (!enabled)
            return;
        if (!username || !password) {
            this.ctx.logger.warn('管理员账号创建已启用，但用户名或密码未配置，请检查插件设置');
            return;
        }
        this.ctx.logger.info('ensuring admin account');
        await this.ctx.database.upsert('user', [{
                id: 0,
                name: username,
                authority: 5,
                password: hashPassword(password),
                createdAt: new Date(),
            }]);
        this.ctx.setInterval(() => this.cleanup(), 60 * 60 * 1000);
    }
    async cleanup() {
        const now = Date.now();
        const keepAttempts = Math.max((this.config.loginLockTime ?? 15 * 60) * 4, 3600);
        await Promise.all([
            this.ctx.database.remove('token', { expiredAt: { $lt: now } }),
            this.ctx.database.remove('refresh_token', { expiredAt: { $lt: now } }),
            this.ctx.database.remove('login_attempt', { createdAt: { $lt: new Date(now - keepAttempts * 1000) } }),
        ]);
    }
    async setAuth(client, auth = client.auth, passive = false) {
        client.auth = auth ?? undefined;
        if (passive)
            return;
        if (auth) {
            const tokens = (await this.ctx.database.get('token', { id: auth.id }))
                .map(({ id, token, refreshToken, ...rest }) => rest)
                .reverse();
            client.send({ type: 'data', body: { key: 'user', value: { ...auth, tokens } } });
        }
        else {
            client.send({ type: 'data', body: { key: 'user', value: null } });
        }
        client.ctx.emit('console/connection', client);
        client.refresh();
    }
    async createToken(client, type, user, remember = false, deviceFingerprint) {
        const { headers, socket } = client.request ?? {};
        const createdAt = new Date();
        const lastUsedAt = new Date();
        const userAgent = headers?.['user-agent']?.toString() ?? '';
        const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? '';
        const expireTime = (remember
            ? (this.config.rememberTokenExpire ?? 30 * 24 * 3600)
            : (this.config.authTokenExpire ?? 7 * 24 * 3600)) * 1000;
        const expiredAt = Date.now() + expireTime;
        const token = randomId();
        const refreshToken = remember ? randomId(60) : undefined;
        const tokenData = {
            id: user.id,
            type,
            expiredAt,
            token,
            createdAt,
            lastUsedAt,
            userAgent,
            address,
            fingerprint: deviceFingerprint,
        };
        if (refreshToken) {
            const refreshExpire = Date.now() + (this.config.refreshTokenExpire ?? 30 * 24 * 3600) * 1000;
            await this.ctx.database.create('refresh_token', {
                id: user.id,
                token: refreshToken,
                expiredAt: refreshExpire,
                createdAt,
                revoked: false,
            });
            tokenData.refreshToken = refreshToken;
            client.send({ type: 'data', body: { key: 'refreshToken', value: refreshToken } });
        }
        await this.ctx.database.create('token', tokenData);
        await this.setAuth(client, {
            id: user.id,
            name: user.name,
            authority: user.authority,
            config: user.config,
            avatar: user.avatar,
            status: user.status ?? 'active',
            expiredAt,
            token,
            lastUsedAt,
            fingerprint: deviceFingerprint,
        });
    }
    async recordLoginAttempt(username, address, fingerprint) {
        await this.ctx.database.create('login_attempt', {
            username,
            address,
            fingerprint,
            success: false,
            createdAt: new Date(),
        });
    }
    async checkLoginLock(username) {
        const lockTimeMs = (this.config.loginLockTime ?? 15 * 60) * 1000;
        const attempts = await this.ctx.database.get('login_attempt', {
            username,
            success: false,
            createdAt: { $gt: new Date(Date.now() - lockTimeMs) },
        });
        if (attempts.length >= (this.config.maxLoginAttempts ?? 5)) {
            throw new Error('登录尝试次数过多，请稍后再试。');
        }
    }
    async sendLoginNotify(message) {
        const notify = this.config.loginNotify;
        if (!notify?.enabled || !notify.target)
            return;
        const target = notify.target.trim();
        const bots = this.ctx.bots;
        if (!bots.length) {
            this.ctx.logger.warn('未找到可用的机器人，跳过登录提醒发送');
            return;
        }
        let bot = bots[0];
        if (notify.robotId) {
            const specified = bots.find(b => b.selfId === notify.robotId);
            if (specified) {
                bot = specified;
            }
            else {
                this.ctx.logger.warn('指定的机器人账号未找到，将使用第一个机器人');
            }
        }
        try {
            await bot.sendMessage(target, message);
            this.ctx.logger.info('登录提醒发送成功');
        }
        catch (e) {
            this.ctx.logger.warn('发送登录提醒失败:', e.message || e);
        }
    }
    initLogin() {
        const self = this;
        const { ctx } = this;
        ctx.console.addListener('login/password', async function (name, password, remember = false, deviceFingerprint = '') {
            const { headers, socket } = this.request ?? {};
            const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? '';
            await self.checkLoginLock(name);
            const [user] = await ctx.database.get('user', { name });
            if (!user || !verifyPassword(password, user.password)) {
                await self.recordLoginAttempt(name, address, deviceFingerprint);
                throw new Error('用户名或密码错误。');
            }
            if (user.status === 'disabled' || user.status === 'frozen') {
                throw new Error('账号已被禁用或冻结。');
            }
            if (user.password && !user.password.includes(':')) {
                await ctx.database.set('user', { id: user.id }, { password: hashPassword(password) });
            }
            await ctx.database.remove('login_attempt', { username: name });
            await self.createToken(this, 'password', {
                id: user.id,
                name: user.name,
                authority: user.authority,
                config: user.config,
                avatar: user.avatar,
                status: user.status ?? 'active',
            }, remember, deviceFingerprint);
            await self.sendLoginNotify(`用户 ${user.name} 于 ${new Date().toLocaleString()} 登录控制台，IP: ${address}`);
        });
        ctx.console.addListener('login/token', async function (aid, token) {
            const [data] = await ctx.database.get('token', { id: aid, token });
            if (!data || data.expiredAt <= Date.now())
                throw new Error('令牌已失效。');
            const [user] = await ctx.database.get('user', { id: aid });
            if (!user)
                throw new Error('用户不存在。');
            if (user.status === 'disabled' || user.status === 'frozen')
                throw new Error('账号已被禁用或冻结。');
            const { headers, socket } = this.request ?? {};
            const address = headers?.['x-forwarded-for']?.toString() ?? socket?.remoteAddress ?? '';
            await ctx.database.set('token', { token }, { lastUsedAt: new Date() });
            await self.setAuth(this, {
                id: user.id,
                name: user.name,
                authority: user.authority,
                config: user.config,
                avatar: user.avatar,
                status: user.status ?? 'active',
                expiredAt: data.expiredAt,
                token,
                lastUsedAt: new Date(),
                fingerprint: data.fingerprint,
            });
            await self.sendLoginNotify(`用户 ${user.name} 于 ${new Date().toLocaleString()} 自动登录控制台，IP: ${address}`);
        });
        ctx.console.addListener('login/refresh', async function (refreshToken) {
            const [data] = await ctx.database.get('refresh_token', { token: refreshToken });
            if (!data || data.expiredAt <= Date.now() || data.revoked)
                throw new Error('刷新令牌无效。');
            const [user] = await ctx.database.get('user', { id: data.id });
            if (!user)
                throw new Error('用户不存在。');
            if (user.status === 'disabled' || user.status === 'frozen')
                throw new Error('账号已被禁用或冻结。');
            await ctx.database.set('refresh_token', { token: refreshToken }, { revoked: true });
            await self.createToken(this, 'token', user, true);
        });
        ctx.on('console/intercept', async (client, listener) => {
            if (!listener.authority)
                return false;
            if (!client.auth)
                return true;
            if (client.auth.expiredAt <= Date.now())
                return true;
            if (client.auth.authority < listener.authority)
                return true;
            const idleTimeoutMs = (this.config.idleTimeout ?? 30 * 60) * 1000;
            if (idleTimeoutMs > 0 && client.auth.lastUsedAt) {
                const last = new Date(client.auth.lastUsedAt).getTime();
                if (Date.now() - last > idleTimeoutMs) {
                    await self.setAuth(client, undefined);
                    return true;
                }
            }
            return false;
        });
        ctx.console.addListener('user/heartbeat', async function () {
            if (!this.auth)
                return;
            const now = new Date();
            await ctx.database.set('token', { token: this.auth.token }, { lastUsedAt: now });
            this.auth.lastUsedAt = now;
        });
        ctx.console.addListener('user/delete-token', async function (inc) {
            if (!this.auth)
                throw new Error('请先登录。');
            const [data] = await ctx.database.get('token', { id: this.auth.id, inc });
            if (!data)
                throw new Error('令牌不存在。');
            const [current] = await ctx.database.get('token', { token: this.auth.token });
            await ctx.database.remove('token', { inc });
            if (data.refreshToken) {
                await ctx.database.set('refresh_token', { token: data.refreshToken }, { revoked: true });
            }
            if (current && current.inc === inc) {
                await self.setAuth(this, undefined);
            }
            else {
                await self.setAuth(this);
            }
        });
        ctx.console.addListener('user/delete-tokens', async function (incs) {
            if (!this.auth)
                throw new Error('请先登录。');
            if (!incs?.length)
                return;
            const [current] = await ctx.database.get('token', { token: this.auth.token });
            const rows = await ctx.database.get('token', { inc: { $in: incs } });
            await ctx.database.remove('token', { inc: { $in: incs } });
            for (const row of rows) {
                if (row.refreshToken) {
                    await ctx.database.set('refresh_token', { token: row.refreshToken }, { revoked: true });
                }
            }
            if (current && incs.includes(current.inc)) {
                await self.setAuth(this, undefined);
            }
            else {
                await self.setAuth(this);
            }
        });
        ctx.console.addListener('user/logout', async function () {
            if (this.auth) {
                const [current] = await ctx.database.get('token', { token: this.auth.token });
                await ctx.database.remove('token', { token: this.auth.token });
                if (current?.refreshToken) {
                    await ctx.database.set('refresh_token', { token: current.refreshToken }, { revoked: true });
                }
            }
            await self.setAuth(this, undefined);
        });
        ctx.console.addListener('user/update', async function (data) {
            if (!this.auth)
                throw new Error('请先登录。');
            if (data.name === '')
                delete data.name;
            if (data.password === '')
                delete data.password;
            if (data.name !== undefined && data.name !== this.auth.name) {
                const [duplicate] = await ctx.database.get('user', { name: data.name });
                if (duplicate && duplicate.id !== this.auth.id)
                    throw new Error('用户名已被占用。');
            }
            if (data.password)
                data.password = hashPassword(data.password);
            await ctx.database.set('user', { id: this.auth.id }, data);
            const { password, ...safe } = data;
            Object.assign(this.auth, safe);
            await self.setAuth(this, undefined, true);
        });
    }
}
AuthService.inject = ['console', 'database'];
AuthService.Admin = koishi_1.Schema.object({
    enabled: koishi_1.Schema.boolean().default(true).description('启用管理员账号创建'),
    username: koishi_1.Schema.string().default('admin').description('管理员用户名'),
    password: koishi_1.Schema.string().role('secret').required().description('管理员密码'),
});
AuthService.Config = koishi_1.Schema.object({
    admin: AuthService.Admin,
    authTokenExpire: koishi_1.Schema.natural().role('s').default(7 * 24 * 3600).min(60).description('用户令牌有效期（秒）'),
    refreshTokenExpire: koishi_1.Schema.natural().role('s').default(30 * 24 * 3600).min(60).description('刷新令牌有效期（秒）'),
    rememberTokenExpire: koishi_1.Schema.natural().role('s').default(30 * 24 * 3600).min(60).description('记住我令牌有效期（秒）'),
    idleTimeout: koishi_1.Schema.natural().role('s').default(30 * 60).min(60).description('空闲超时时间（秒）'),
    maxLoginAttempts: koishi_1.Schema.natural().default(5).description('最大登录尝试次数'),
    loginLockTime: koishi_1.Schema.natural().role('s').default(15 * 60).min(60).description('登录锁定时间（秒）'),
    loginNotify: koishi_1.Schema.object({
        enabled: koishi_1.Schema.boolean().default(false).description('启用登录提醒'),
        target: koishi_1.Schema.string().default('').description('目标群号'),
        robotId: koishi_1.Schema.string().default('').description('指定机器人账号（留空自动使用第一个机器人）'),
    }).description('登录提醒'),
}).i18n({
    'zh-CN': require('./locales/zh-CN.json'),
});
(function (AuthService) {
    AuthService.filter = false;
})(AuthService || (AuthService = {}));
exports.default = AuthService;
