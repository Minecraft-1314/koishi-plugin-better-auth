import { Context, Schema, Service } from 'koishi';
import { Client } from '@koishijs/console';
import { PluginConfig } from './config';
import { TokenManager } from './token';
import { LoginHandler } from './login';
import { CleanupService } from './cleanup';
import { LoginNotification } from './notification';
import { DebugLogger } from './debug';
import { ExtensionManager } from './extension';
import { Auth } from './types';
declare class AuthService extends Service {
    config: PluginConfig;
    static inject: string[];
    static Config: Schema<PluginConfig>;
    tokenManager: TokenManager;
    loginHandler: LoginHandler;
    cleanup: CleanupService;
    notification: LoginNotification;
    debug: DebugLogger;
    extensions: ExtensionManager;
    constructor(ctx: Context, config: PluginConfig);
    private registerModels;
    private registerEntry;
    start(): Promise<void>;
    setAuth(client: Client, auth?: Auth | null | undefined, passive?: boolean): Promise<void>;
    private registerListeners;
}
declare namespace AuthService {
    const filter = false;
}
export default AuthService;
