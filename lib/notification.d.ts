import { Context } from 'koishi';
import { DebugLogger } from './debug';
export declare const DEFAULT_LOGIN_NOTIFY_MESSAGE = "\u7528\u6237 {username} \u4E8E {time} {type}\u63A7\u5236\u53F0\uFF0CIP: {address}";
export declare const DEFAULT_FAIL_NOTIFY_MESSAGE = "\u7528\u6237 {username} \u4E8E {time} \u767B\u5F55\u5931\u8D25\uFF0C\u539F\u56E0: {reason}\uFF0CIP: {address}";
export interface NotificationConfig {
    enabled?: boolean;
    target?: string;
    robotId?: string;
    loginSuccess?: boolean;
    loginFail?: boolean;
    loginNotifyMessage?: string;
    failNotifyMessage?: string;
}
export declare class LoginNotification {
    private ctx;
    private config;
    private debug;
    constructor(ctx: Context, config: NotificationConfig, debug: DebugLogger);
    send(message: string): Promise<void>;
    notifyLogin(username: string, address: string, type: string): Promise<void>;
    notifyLoginFail(username: string, address: string, reason: string): Promise<void>;
}
