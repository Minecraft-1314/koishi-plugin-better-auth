"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionManager = void 0;
class ExtensionManager {
    constructor(debug) {
        this.debug = debug;
        this.hooks = [];
    }
    register(hook) {
        this.hooks.push(hook);
        this.debug.extension('注册扩展钩子');
    }
    unregister(hook) {
        const index = this.hooks.indexOf(hook);
        if (index >= 0) {
            this.hooks.splice(index, 1);
            this.debug.extension('移除扩展钩子');
        }
    }
    async emitLoginAttempt(data) {
        for (const hook of this.hooks) {
            try {
                await hook.onLoginAttempt?.(data);
            }
            catch (e) {
                this.debug.extension('onLoginAttempt 钩子执行失败: ' + (e.message || e));
            }
        }
    }
    async emitLoginSuccess(data) {
        for (const hook of this.hooks) {
            try {
                await hook.onLoginSuccess?.(data);
            }
            catch (e) {
                this.debug.extension('onLoginSuccess 钩子执行失败: ' + (e.message || e));
            }
        }
    }
    async emitLoginFail(data) {
        for (const hook of this.hooks) {
            try {
                await hook.onLoginFail?.(data);
            }
            catch (e) {
                this.debug.extension('onLoginFail 钩子执行失败: ' + (e.message || e));
            }
        }
    }
    async emitTokenCreated(data) {
        for (const hook of this.hooks) {
            try {
                await hook.onTokenCreated?.(data);
            }
            catch (e) {
                this.debug.extension('onTokenCreated 钩子执行失败: ' + (e.message || e));
            }
        }
    }
    async emitTokenRevoked(data) {
        for (const hook of this.hooks) {
            try {
                await hook.onTokenRevoked?.(data);
            }
            catch (e) {
                this.debug.extension('onTokenRevoked 钩子执行失败: ' + (e.message || e));
            }
        }
    }
    get hookCount() {
        return this.hooks.length;
    }
}
exports.ExtensionManager = ExtensionManager;
