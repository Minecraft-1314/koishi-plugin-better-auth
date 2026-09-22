import { User } from 'koishi'
import { Client } from '@koishijs/console'

declare module 'koishi' {
  interface Context {
    auth: import('./auth').default
  }

  interface User {
    password: string
    config: any
    lastLoginAt?: Date
    failedAttempts?: number
    lockedUntil?: Date
    avatar?: string
    status?: 'active' | 'disabled' | 'frozen'
  }

  interface Tables {
    token: LoginToken
    refresh_token: RefreshToken
    login_attempt: LoginAttempt
  }
}

declare module '@koishijs/console' {
  interface Client {
    auth?: Auth
    deviceFingerprint?: string
  }

  namespace Console {
    interface Services {
      user: DataService<AuthData>
    }
  }

  interface Events {
    'login/password'(this: Client, name: string, password: string, remember?: boolean, deviceFingerprint?: string): void
    'login/token'(this: Client, id: number, token: string): void
    'login/refresh'(this: Client, refreshToken: string): void
    'user/delete-token'(this: Client, inc: number): void
    'user/delete-tokens'(this: Client, incs: number[]): void
    'user/update'(this: Client, data: UserUpdate): void
    'user/logout'(this: Client): void
    'user/heartbeat'(this: Client): void
    'config/better-auth/update'(this: Client, data: any): void
  }
}

export interface LoginToken {
  inc: number
  id: number
  type: LoginType
  token: string
  expiredAt: number
  createdAt: Date
  lastUsedAt: Date
  userAgent: string
  address: string
  fingerprint?: string
  refreshToken?: string
}

export interface RefreshToken {
  inc: number
  id: number
  token: string
  expiredAt: number
  createdAt: Date
  revoked: boolean
}

export interface LoginAttempt {
  inc: number
  username?: string
  address?: string
  fingerprint?: string
  success: boolean
  createdAt: Date
}

export type Auth =
  & Pick<LoginToken, 'token' | 'expiredAt' | 'lastUsedAt' | 'fingerprint'>
  & Pick<User, 'id' | 'name' | 'authority' | 'config' | 'avatar' | 'status'>

export interface AuthData extends Auth {
  tokens: Omit<LoginToken, 'token' | 'id'>[]
}

export type LoginType = 'password' | 'token'

export type UserUpdate = Partial<Pick<User, 'name' | 'password' | 'config' | 'avatar'>>

export interface ExtensionHook {
  onLoginAttempt?: (data: { username: string; address: string; success: boolean }) => void | Promise<void>
  onLoginSuccess?: (data: { userId: number; username: string; type: LoginType }) => void | Promise<void>
  onLoginFail?: (data: { username: string; address: string; reason: string }) => void | Promise<void>
  onTokenCreated?: (data: { userId: number; token: string; type: LoginType }) => void | Promise<void>
  onTokenRevoked?: (data: { userId: number; token: string }) => void | Promise<void>
}
