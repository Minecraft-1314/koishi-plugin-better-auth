import { Context, Schema, Service, User } from 'koishi';
import { Client } from '@koishijs/console';
declare module 'koishi' {
    interface Context {
        auth: AuthService;
    }
    interface User {
        password: string;
        config: any;
        lastLoginAt?: Date;
        failedAttempts?: number;
        lockedUntil?: Date;
        avatar?: string;
        status?: 'active' | 'disabled' | 'frozen';
    }
    interface Tables {
        token: LoginToken;
        refresh_token: RefreshToken;
        login_attempt: LoginAttempt;
    }
}
declare module '@koishijs/console' {
    interface Client {
        auth?: Auth;
        deviceFingerprint?: string;
    }
    namespace Console {
        interface Services {
            user: DataService<AuthData>;
        }
    }
    interface Events {
        'login/password'(this: Client, name: string, password: string, remember?: boolean, deviceFingerprint?: string): void;
        'login/token'(this: Client, id: number, token: string): void;
        'login/refresh'(this: Client, refreshToken: string): void;
        'user/delete-token'(this: Client, inc: number): void;
        'user/delete-tokens'(this: Client, incs: number[]): void;
        'user/update'(this: Client, data: UserUpdate): void;
        'user/logout'(this: Client): void;
        'user/heartbeat'(this: Client): void;
    }
}
export interface LoginToken {
    inc: number;
    id: number;
    type: LoginType;
    token: string;
    expiredAt: number;
    createdAt: Date;
    lastUsedAt: Date;
    userAgent: string;
    address: string;
    fingerprint?: string;
    refreshToken?: string;
}
export interface RefreshToken {
    inc: number;
    id: number;
    token: string;
    expiredAt: number;
    createdAt: Date;
    revoked: boolean;
}
export interface LoginAttempt {
    inc: number;
    username?: string;
    address?: string;
    fingerprint?: string;
    success: boolean;
    createdAt: Date;
}
export type Auth = Pick<LoginToken, 'token' | 'expiredAt' | 'lastUsedAt' | 'fingerprint'> & Pick<User, 'id' | 'name' | 'authority' | 'config' | 'avatar' | 'status'>;
interface AuthData extends Auth {
    tokens: Omit<LoginToken, 'token' | 'id'>[];
}
type LoginType = 'password' | 'token';
export declare function randomId(length?: number): string;
export type UserUpdate = Partial<Pick<User, 'name' | 'password' | 'config' | 'avatar'>>;
declare class AuthService extends Service {
    config: AuthService.Config;
    static inject: string[];
    static Admin: Schema<AuthService.Admin>;
    static Config: Schema<AuthService.Config>;
    constructor(ctx: Context, config: AuthService.Config);
    start(): Promise<void>;
    cleanup(): Promise<void>;
    setAuth(client: Client, auth?: Auth | null | undefined, passive?: boolean): Promise<void>;
    createToken(client: Client, type: LoginType, user: Pick<User, 'id' | 'name' | 'authority' | 'config' | 'avatar' | 'status'>, remember?: boolean, deviceFingerprint?: string): Promise<void>;
    recordLoginAttempt(username: string, address: string, fingerprint: string): Promise<void>;
    checkLoginLock(username: string): Promise<void>;
    sendLoginNotify(message: string): Promise<void>;
    initLogin(): void;
}
declare namespace AuthService {
    const filter = false;
    interface Admin {
        enabled?: boolean;
        username?: string;
        password?: string;
    }
    interface LoginNotify {
        enabled?: boolean;
        target?: string;
        robotId?: string;
    }
    interface Config {
        admin?: Admin;
        authTokenExpire?: number;
        refreshTokenExpire?: number;
        rememberTokenExpire?: number;
        idleTimeout?: number;
        maxLoginAttempts?: number;
        loginLockTime?: number;
        loginNotify?: LoginNotify;
    }
}
export default AuthService;
