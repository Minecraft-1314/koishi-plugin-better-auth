import { Context } from 'koishi';
import { DebugLogger } from './debug';
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
    update(newConfig: NotificationConfig): void;
    send(message: string): Promise<void>;
    notifyLogin(username: string, address: string, type: string): Promise<void>;
    notifyLoginFail(username: string, address: string, reason: string): Promise<void>;
}
