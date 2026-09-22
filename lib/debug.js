"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogger = void 0;
class DebugLogger {
    constructor(config) {
        this.config = config;
        this.prefix = '[better-auth]';
    }
    isEnabled(category) {
        return this.config.enabled && this.config[category];
    }
    token(message, ...args) {
        if (!this.isEnabled('logTokenOps'))
            return;
        console.log(`${this.prefix}[token] ${message}`, ...args);
    }
    login(message, ...args) {
        if (!this.isEnabled('logLoginAttempts'))
            return;
        console.log(`${this.prefix}[login] ${message}`, ...args);
    }
    notify(message, ...args) {
        if (!this.isEnabled('logNotifications'))
            return;
        console.log(`${this.prefix}[notify] ${message}`, ...args);
    }
    cleanup(message, ...args) {
        if (!this.isEnabled('logCleanup'))
            return;
        console.log(`${this.prefix}[cleanup] ${message}`, ...args);
    }
    extension(message, ...args) {
        if (!this.isEnabled('logExtensions'))
            return;
        console.log(`${this.prefix}[extension] ${message}`, ...args);
    }
    update(newConfig) {
        this.config = newConfig;
    }
}
exports.DebugLogger = DebugLogger;
