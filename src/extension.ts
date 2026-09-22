import { ExtensionHook } from './types'
import { DebugLogger } from './debug'

export class ExtensionManager {
  private hooks: ExtensionHook[] = []

  constructor(private debug: DebugLogger) {}

  register(hook: ExtensionHook) {
    this.hooks.push(hook)
    this.debug.extension('注册扩展钩子')
  }

  unregister(hook: ExtensionHook) {
    const index = this.hooks.indexOf(hook)
    if (index >= 0) {
      this.hooks.splice(index, 1)
      this.debug.extension('移除扩展钩子')
    }
  }

  async emitLoginAttempt(data: { username: string; address: string; success: boolean }) {
    for (const hook of this.hooks) {
      try {
        await hook.onLoginAttempt?.(data)
      } catch (e: any) {
        this.debug.extension('onLoginAttempt 钩子执行失败: ' + (e.message || e))
      }
    }
  }

  async emitLoginSuccess(data: { userId: number; username: string; type: import('./types').LoginType }) {
    for (const hook of this.hooks) {
      try {
        await hook.onLoginSuccess?.(data)
      } catch (e: any) {
        this.debug.extension('onLoginSuccess 钩子执行失败: ' + (e.message || e))
      }
    }
  }

  async emitLoginFail(data: { username: string; address: string; reason: string }) {
    for (const hook of this.hooks) {
      try {
        await hook.onLoginFail?.(data)
      } catch (e: any) {
        this.debug.extension('onLoginFail 钩子执行失败: ' + (e.message || e))
      }
    }
  }

  async emitTokenCreated(data: { userId: number; token: string; type: import('./types').LoginType }) {
    for (const hook of this.hooks) {
      try {
        await hook.onTokenCreated?.(data)
      } catch (e: any) {
        this.debug.extension('onTokenCreated 钩子执行失败: ' + (e.message || e))
      }
    }
  }

  async emitTokenRevoked(data: { userId: number; token: string }) {
    for (const hook of this.hooks) {
      try {
        await hook.onTokenRevoked?.(data)
      } catch (e: any) {
        this.debug.extension('onTokenRevoked 钩子执行失败: ' + (e.message || e))
      }
    }
  }

  get hookCount() {
    return this.hooks.length
  }
}
