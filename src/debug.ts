export interface DebugConfig {
  enabled?: boolean
}

export class DebugLogger {
  private prefix = '[better-auth]'

  constructor(private config: DebugConfig) {}

  private get isEnabled() {
    return !!this.config.enabled
  }

  token(message: string, ...args: any[]) {
    if (!this.isEnabled) return
    console.log(`${this.prefix}[token] ${message}`, ...args)
  }

  login(message: string, ...args: any[]) {
    if (!this.isEnabled) return
    console.log(`${this.prefix}[login] ${message}`, ...args)
  }

  notify(message: string, ...args: any[]) {
    if (!this.isEnabled) return
    console.log(`${this.prefix}[notify] ${message}`, ...args)
  }

  cleanup(message: string, ...args: any[]) {
    if (!this.isEnabled) return
    console.log(`${this.prefix}[cleanup] ${message}`, ...args)
  }

  extension(message: string, ...args: any[]) {
    if (!this.isEnabled) return
    console.log(`${this.prefix}[extension] ${message}`, ...args)
  }
}
