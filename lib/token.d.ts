import { Context } from 'koishi';
import { Client } from '@koishijs/console';
import { LoginToken, LoginType } from './types';
import { TokenManagerConfig } from './config';
import { DebugLogger } from './debug';
import { ExtensionManager } from './extension';
export declare class TokenManager {
    private ctx;
    private config;
    private debug;
    private extensions;
    constructor(ctx: Context, config: TokenManagerConfig, debug: DebugLogger, extensions: ExtensionManager);
    update(newConfig: TokenManagerConfig): void;
    create(client: Client, type: LoginType, user: {
        id: number;
        name: string;
        authority: number;
        config: any;
        avatar?: string;
        status?: string;
    }, remember?: boolean, deviceFingerprint?: string): Promise<{
        id: number;
        name: string;
        authority: number;
        config: any;
        avatar: string | undefined;
        status: string;
        expiredAt: number;
        token: string;
        lastUsedAt: Date;
        fingerprint: string | undefined;
    }>;
    enforceTokenLimit(userId: number): Promise<void>;
    revokeAll(userId: number): Promise<void>;
    revokeOne(inc: number): Promise<LoginToken | null>;
    revokeBatch(incs: number[]): Promise<void>;
    updateLastUsed(token: string): Promise<Date>;
}
