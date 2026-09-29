import { SecurityConfig } from './config';
export declare function randomId(length?: number): string;
export declare function hashPassword(password: string): string;
export declare function verifyPassword(plain: string, hashed: string): boolean;
export declare function checkPasswordPolicy(password: string, config?: SecurityConfig): string | null;
export declare function fingerprint(value: string): string;
