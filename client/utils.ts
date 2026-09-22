import { useStorage } from '@koishijs/client'
import { ref } from 'vue'

declare module '@koishijs/plugin-console' {
  import type { DataService } from '@koishijs/plugin-console'
  import type { Client } from '@koishijs/plugin-console'

  interface Events {
    'login/password'(this: Client, name: string, password: string, remember?: boolean, deviceFingerprint?: string): void
    'login/token'(this: Client, id: number, token: string): void
    'login/refresh'(this: Client, refreshToken: string): void
    'user/delete-token'(this: Client, inc: number): void
    'user/delete-tokens'(this: Client, incs: number[]): void
    'user/update'(this: Client, data: any): void
    'user/logout'(this: Client): void
    'user/heartbeat'(this: Client): void
    'config/better-auth/update'(this: Client, data: any): void
  }

  namespace Console {
    interface Services {
      user: DataService<any>
      refreshToken: DataService<string>
    }
  }
}

interface SharedConfig {
  id?: number
  name?: string
  token?: string
  expiredAt?: number
  refreshToken?: string
}

export const shared = useStorage<SharedConfig>('auth', 3, () => ({}))

export const loginPassword = ref('')


export function getDeviceFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let canvasString = ''
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('auth-fingerprint', 2, 2)
    canvasString = canvas.toDataURL()
  }
  const components = [
    navigator.userAgent,
    navigator.language,
    screen?.width ?? 0,
    screen?.height ?? 0,
    screen?.colorDepth ?? 0,
    new Date().getTimezoneOffset(),
    canvasString,
  ]
  return components.join('||')
}
