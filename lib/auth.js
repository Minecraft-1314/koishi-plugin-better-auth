"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koishi_1 = require("koishi");
const config_1 = require("./config");
const config_2 = require("./config");
const password_1 = require("./password");
const token_1 = require("./token");
const login_1 = require("./login");
const cleanup_1 = require("./cleanup");
const notification_1 = require("./notification");
const debug_1 = require("./debug");
const extension_1 = require("./extension");
const path_1 = require("path");
class AuthService extends koishi_1.Service {
    constructor(ctx, config) {
        super(ctx, 'auth');
        this.config = config;
        this.config = (0, config_2.migrateLegacyConfig)(config);
        this.debug = new debug_1.DebugLogger(config.debug ?? {});
        this.extensions = new extension_1.ExtensionManager(this.debug);
        this.notification = new notification_1.LoginNotification(ctx, config.notification ?? {}, this.debug);
        this.tokenManager = new token_1.TokenManager(ctx, config.token ?? {}, this.debug, this.extensions);
        this.cleanup = new cleanup_1.CleanupService(ctx, config.cleanup ?? {}, this.debug);
        this.loginHandler = new login_1.LoginHandler(ctx, config.security ?? {}, this.tokenManager, this.notification, this.debug, this.extensions, this.setAuth.bind(this));
        this.registerModels(ctx);
        this.registerEntry(ctx);
        this.registerListeners(ctx);
    }
    registerModels(ctx) {
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
    }
    registerEntry(ctx) {
        ctx.console.addEntry({
            dev: (0, path_1.resolve)(__dirname, '../client/index.ts'),
            prod: (0, path_1.resolve)(__dirname, '../dist'),
        });
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
                password: (0, password_1.hashPassword)(password),
                createdAt: new Date(),
            }]);
        this.cleanup.start();
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
    registerListeners(ctx) {
        const self = this;
        ctx.console.addListener('login/password', async function (name, password, remember = false, deviceFingerprint = '') {
            await self.loginHandler.handlePasswordLogin(this, name, password, remember, deviceFingerprint);
        });
        ctx.console.addListener('login/token', async function (aid, token) {
            await self.loginHandler.handleTokenLogin(this, aid, token);
        });
        ctx.console.addListener('login/refresh', async function (refreshToken) {
            await self.loginHandler.handleRefreshLogin(this, refreshToken);
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
            const idleTimeoutMs = (self.config.security?.idleTimeout ?? 1800) * 1000;
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
            const data = await self.tokenManager.revokeOne(inc);
            if (!data)
                throw new Error('令牌不存在。');
            const [current] = await ctx.database.get('token', { token: this.auth.token });
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
            await self.tokenManager.revokeBatch(incs);
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
                data.password = (0, password_1.hashPassword)(data.password);
            await ctx.database.set('user', { id: this.auth.id }, data);
            const { password, ...safe } = data;
            Object.assign(this.auth, safe);
            await self.setAuth(this, undefined, true);
        });
        ctx.console.addListener('config/better-auth/update', async function (data) {
            if (!this.auth || this.auth.authority < 5)
                throw new Error('权限不足。');
            const merged = {
                admin: data.admin ?? {},
                security: data.security ?? {},
                token: data.token ?? {},
                cleanup: data.cleanup ?? {},
                notification: data.notification ?? {},
                debug: data.debug ?? {},
            };
            if (!merged.admin.password)
                delete merged.admin.password;
            const mergedConfig = (0, config_2.migrateLegacyConfig)(merged);
            self.config = mergedConfig;
            self.debug.update(mergedConfig.debug ?? {});
            self.extensions = new extension_1.ExtensionManager(self.debug);
            self.notification.update(mergedConfig.notification ?? {});
            self.tokenManager.update(mergedConfig.token ?? {});
            self.cleanup.update(mergedConfig.cleanup ?? {});
            self.loginHandler.update(mergedConfig.security ?? {});
            return 'ok';
        });
    }
}
AuthService.inject = ['console', 'database'];
AuthService.Config = config_1.PluginSchema;
(function (AuthService) {
    AuthService.filter = false;
})(AuthService || (AuthService = {}));
exports.default = AuthService;
