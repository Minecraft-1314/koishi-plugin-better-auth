import { ExtensionHook } from './types';
import { DebugLogger } from './debug';
export declare class ExtensionManager {
    private debug;
    private hooks;
    constructor(debug: DebugLogger);
    register(hook: ExtensionHook): void;
    unregister(hook: ExtensionHook): void;
    emitLoginAttempt(data: {
        username: string;
        address: string;
        success: boolean;
    }): Promise<void>;
    emitLoginSuccess(data: {
        userId: number;
        username: string;
        type: import('./types').LoginType;
    }): Promise<void>;
    emitLoginFail(data: {
        username: string;
        address: string;
        reason: string;
    }): Promise<void>;
    emitTokenCreated(data: {
        userId: number;
        token: string;
        type: import('./types').LoginType;
    }): Promise<void>;
    emitTokenRevoked(data: {
        userId: number;
        token: string;
    }): Promise<void>;
    get hookCount(): number;
}
