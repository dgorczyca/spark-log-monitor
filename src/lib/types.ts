export interface LogMatch {
  value: string
  timestamp: number
}

export interface Section {
  id: string
  name: string
  rule: string
  matches: LogMatch[]
}

export interface LogEntry {
  timestamp: number
  message: string
  level: 'info' | 'warn' | 'error' | 'debug'
}
