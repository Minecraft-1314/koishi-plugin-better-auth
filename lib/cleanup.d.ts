import { Context } from 'koishi';
import { DebugLogger } from './debug';
export interface CleanupConfig {
    enabled?: boolean;
    interval?: number;
    tokenRetention?: number;
    refreshTokenRetention?: number;
    attemptRetention?: number;
}
export declare class CleanupService {
    private ctx;
    private config;
    private debug;
    constructor(ctx: Context, config: CleanupConfig, debug: DebugLogger);
    start(): void;
    update(newConfig: CleanupConfig): void;
    run(): Promise<void>;
}
