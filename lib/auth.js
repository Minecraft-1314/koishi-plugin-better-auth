"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koishi_1 = require("koishi");
const config_1 = require("./config");
const password_1 = require("./password");
const token_1 = require("./token");
const login_1 = require("./login");
const cleanup_1 = require("./cleanup");
const notification_1 = require("./notification");
const debug_1 = require("./debug");
const extension_1 = require("./extension");
const path_1 = require("path");
const ADMIN_USER_ID = 0;
const ADMIN_AUTHORITY = 5;
const ADMIN_PASSWORD_STATE = 'admin-password';
class AuthService extends koishi_1.Service {
    constructor(ctx, config) {
        super(ctx, 'auth');
        this.config = config;
        this.debug = new debug_1.DebugLogger(config.debug);
        this.extensions = new extension_1.ExtensionManager(this.debug);
        this.notification = new notification_1.LoginNotification(ctx, config.notification, this.debug);
        this.tokenManager = new token_1.TokenManager(ctx, config.token, this.debug, this.extensions);
        this.cleanup = new cleanup_1.CleanupService(ctx, config.cleanup, this.debug);
        this.loginHandler = new login_1.LoginHandler(ctx, config.security, this.tokenManager, this.notification, this.debug, this.extensions, this.setAuth.bind(this));
        this.registerModels(ctx);
        this.registerEntry(ctx);
        this.registerListeners(ctx);
    }
    registerModels(ctx) {
        ctx.model.extend('user', {
            password: 'string(255)',
            config: { type: 'json', length: 65535, initial: null },
            lastLoginAt: 'timestamp',
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
        ctx.model.extend('auth_state', {
            key: 'string(255)',
            value: 'string(255)',
        }, { primary: 'key' });
    }
    registerEntry(ctx) {
        ctx.console.addEntry({
            dev: (0, path_1.resolve)(__dirname, '../client/index.ts'),
            prod: (0, path_1.resolve)(__dirname, '../dist'),
        });
    }
    async start() {
        this.cleanup.start();
        await this.syncAdminAccount();
    }
    async syncAdminAccount() {
        const { enabled, username, password } = this.config.admin;
        if (!enabled)
            return;
        if (!username || !password) {
            this.ctx.logger.warn('better-auth: 已启用管理员账号，但未配置用户名或密码，请在插件配置页补全');
            return;
        }
        const policyError = (0, password_1.checkPasswordPolicy)(password, this.config.security);
        if (policyError)
            this.ctx.logger.warn(`better-auth: 管理员密码不满足当前密码策略（${policyError}）`);
        try {
            const current = (0, password_1.fingerprint)(password);
            const [admin] = await this.ctx.database.get('user', { id: ADMIN_USER_ID });
            const [state] = await this.ctx.database.get('auth_state', { key: ADMIN_PASSWORD_STATE });
            if (!admin) {
                const [conflict] = await this.ctx.database.get('user', { name: username });
                if (conflict) {
                    this.ctx.logger.error(`better-auth: 管理员账号创建失败，用户名 ${username} 已被占用，请更换管理员用户名或删除同名账号`);
                    return;
                }
                await this.ctx.database.create('user', {
                    id: ADMIN_USER_ID,
                    name: username,
                    authority: ADMIN_AUTHORITY,
                    password: (0, password_1.hashPassword)(password),
                    createdAt: new Date(),
                });
                await this.ctx.database.upsert('auth_state', [{ key: ADMIN_PASSWORD_STATE, value: current }]);
                this.ctx.logger.info(`better-auth: 管理员账号 ${username} 已创建`);
                return;
            }
            if (!state) {
                await this.ctx.database.upsert('auth_state', [{ key: ADMIN_PASSWORD_STATE, value: current }]);
                this.ctx.logger.info(`better-auth: 已记录管理员账号 ${admin.name} 的密码状态，后续仅在配置页修改密码时同步`);
                return;
            }
            if (state.value === current)
                return;
            await this.ctx.database.set('user', { id: ADMIN_USER_ID }, { password: (0, password_1.hashPassword)(password) });
            await this.ctx.database.upsert('auth_state', [{ key: ADMIN_PASSWORD_STATE, value: current }]);
            this.ctx.logger.info(`better-auth: 管理员账号 ${admin.name} 的密码已按配置更新`);
        }
        catch (e) {
            this.ctx.logger.error('better-auth: 同步管理员账号失败：' + (e?.message || e));
        }
    }
    async setAuth(client, auth) {
        client.auth = auth ?? undefined;
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
            const idleTimeoutMs = (self.config.security.idleTimeout ?? 1800) * 1000;
            if (idleTimeoutMs > 0 && client.auth.lastUsedAt) {
                const last = new Date(client.auth.lastUsedAt).getTime();
                if (Date.now() - last > idleTimeoutMs) {
                    await self.setAuth(client, null);
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
            const data = await self.tokenManager.revokeOne(inc, this.auth.id);
            if (!data)
                throw new Error('令牌不存在。');
            const [current] = await ctx.database.get('token', { token: this.auth.token });
            if (current && current.inc === inc) {
                await self.setAuth(this, null);
            }
            else {
                await self.setAuth(this, this.auth);
            }
        });
        ctx.console.addListener('user/delete-tokens', async function (incs) {
            if (!this.auth)
                throw new Error('请先登录。');
            if (!incs?.length)
                return;
            const [current] = await ctx.database.get('token', { token: this.auth.token });
            const revoked = await self.tokenManager.revokeBatch(incs, this.auth.id);
            if (!revoked)
                throw new Error('部分会话不存在或不属于当前账号。');
            if (current && incs.includes(current.inc)) {
                await self.setAuth(this, null);
            }
            else {
                await self.setAuth(this, this.auth);
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
            await self.setAuth(this, null);
        });
        ctx.console.addListener('user/update', async function (data) {
            if (!this.auth)
                throw new Error('请先登录。');
            const { name, password } = data;
            const patch = {};
            if (name !== undefined) {
                if (!name)
                    throw new Error('用户名不能为空。');
                if (name !== this.auth.name) {
                    const [duplicate] = await ctx.database.get('user', { name });
                    if (duplicate && duplicate.id !== this.auth.id)
                        throw new Error('用户名已被占用。');
                }
                patch.name = name;
            }
            if (data.config !== undefined)
                patch.config = data.config;
            if (data.avatar !== undefined)
                patch.avatar = data.avatar;
            if (password !== undefined) {
                if (!password)
                    throw new Error('新密码不能为空，如需修改请填写新密码。');
                const policyError = (0, password_1.checkPasswordPolicy)(password, self.config.security);
                if (policyError)
                    throw new Error(policyError + '。');
                patch.password = (0, password_1.hashPassword)(password);
            }
            if (!Object.keys(patch).length)
                return;
            await ctx.database.set('user', { id: this.auth.id }, patch);
            if (patch.name)
                this.auth.name = patch.name;
            if (patch.config !== undefined)
                this.auth.config = patch.config;
            if (patch.avatar !== undefined)
                this.auth.avatar = patch.avatar;
            if (patch.password && self.config.token.revokeOnPasswordChange) {
                await self.tokenManager.revokeAll(this.auth.id, this.auth.token);
            }
            await self.setAuth(this, this.auth);
        });
    }
}
AuthService.inject = ['console', 'database'];
AuthService.Config = config_1.PluginSchema;
(function (AuthService) {
    AuthService.filter = false;
})(AuthService || (AuthService = {}));
exports.default = AuthService;
