export interface DebugConfig {
  enabled?: boolean
  logTokenOps?: boolean
  logLoginAttempts?: boolean
  logNotifications?: boolean
  logCleanup?: boolean
  logExtensions?: boolean
}

export class DebugLogger {
  private prefix = '[better-auth]'

  constructor(private config: DebugConfig) {}

  private isEnabled(category: keyof Omit<DebugConfig, 'enabled'>) {
    return this.config.enabled && this.config[category]
  }

  token(message: string, ...args: any[]) {
    if (!this.isEnabled('logTokenOps')) return
    console.log(`${this.prefix}[token] ${message}`, ...args)
  }

  login(message: string, ...args: any[]) {
    if (!this.isEnabled('logLoginAttempts')) return
    console.log(`${this.prefix}[login] ${message}`, ...args)
  }

  notify(message: string, ...args: any[]) {
    if (!this.isEnabled('logNotifications')) return
    console.log(`${this.prefix}[notify] ${message}`, ...args)
  }

  cleanup(message: string, ...args: any[]) {
    if (!this.isEnabled('logCleanup')) return
    console.log(`${this.prefix}[cleanup] ${message}`, ...args)
  }

  extension(message: string, ...args: any[]) {
    if (!this.isEnabled('logExtensions')) return
    console.log(`${this.prefix}[extension] ${message}`, ...args)
  }

  update(newConfig: DebugConfig) {
    this.config = newConfig
  }
}
