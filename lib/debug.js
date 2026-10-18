"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogger = void 0;
class DebugLogger {
    constructor(config) {
        this.config = config;
        this.prefix = '[better-auth]';
    }
    get isEnabled() {
        return !!this.config.enabled;
    }
    token(message, ...args) {
        if (!this.isEnabled)
            return;
        console.log(`${this.prefix}[token] ${message}`, ...args);
    }
    login(message, ...args) {
        if (!this.isEnabled)
            return;
        console.log(`${this.prefix}[login] ${message}`, ...args);
    }
    notify(message, ...args) {
        if (!this.isEnabled)
            return;
        console.log(`${this.prefix}[notify] ${message}`, ...args);
    }
    cleanup(message, ...args) {
        if (!this.isEnabled)
            return;
        console.log(`${this.prefix}[cleanup] ${message}`, ...args);
    }
    extension(message, ...args) {
        if (!this.isEnabled)
            return;
        console.log(`${this.prefix}[extension] ${message}`, ...args);
    }
}
exports.DebugLogger = DebugLogger;
