import { Context } from 'koishi';
import { TokenManager } from './token';
import { SecurityConfig } from './config';
import { DebugLogger } from './debug';
import { LoginNotification } from './notification';
import { ExtensionManager } from './extension';
type SetAuthFn = (client: any, auth: any, passive?: boolean) => Promise<void>;
export declare class LoginHandler {
    private ctx;
    private config;
    private tokenManager;
    private notification;
    private debug;
    private extensions;
    private setAuth;
    constructor(ctx: Context, config: SecurityConfig, tokenManager: TokenManager, notification: LoginNotification, debug: DebugLogger, extensions: ExtensionManager, setAuth: SetAuthFn);
    update(newConfig: SecurityConfig): void;
    recordAttempt(username: string, address: string, fingerprint: string, success: boolean): Promise<void>;
    checkLock(username: string): Promise<void>;
    handlePasswordLogin(client: any, name: string, password: string, remember: boolean, deviceFingerprint: string): Promise<void>;
    handleTokenLogin(client: any, aid: number, token: string): Promise<void>;
    handleRefreshLogin(client: any, refreshToken: string): Promise<void>;
}
export {};
