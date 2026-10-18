export interface DebugConfig {
    enabled?: boolean;
}
export declare class DebugLogger {
    private config;
    private prefix;
    constructor(config: DebugConfig);
    private get isEnabled();
    token(message: string, ...args: any[]): void;
    login(message: string, ...args: any[]): void;
    notify(message: string, ...args: any[]): void;
    cleanup(message: string, ...args: any[]): void;
    extension(message: string, ...args: any[]): void;
}
