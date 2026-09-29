import { Schema } from 'koishi';
import { CleanupConfig } from './cleanup';
import { NotificationConfig } from './notification';
import { DebugConfig } from './debug';
export interface AdminConfig {
    enabled?: boolean;
    username?: string;
    password?: string;
}
export interface TokenConfig {
    authExpire?: number;
    refreshExpire?: number;
    rememberExpire?: number;
}
export interface SecurityConfig {
    maxLoginAttempts?: number;
    lockTime?: number;
    idleTimeout?: number;
    passwordMinLength?: number;
    passwordRequireSpecialChar?: boolean;
}
export interface TokenManagerConfig extends TokenConfig {
    maxTokensPerUser?: number;
    revokeOnPasswordChange?: boolean;
}
export interface PluginConfig {
    admin: AdminConfig;
    security: SecurityConfig;
    token: TokenManagerConfig;
    cleanup: CleanupConfig;
    notification: NotificationConfig;
    debug: DebugConfig;
}
export declare const PluginSchema: Schema<PluginConfig>;
