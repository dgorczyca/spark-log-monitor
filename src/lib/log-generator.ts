import { LogEntry } from './types'

const LOG_TEMPLATES = [
  { level: 'info' as const, template: 'User {user} logged in from {ip}' },
  { level: 'info' as const, template: 'Request to {endpoint} completed in {time}ms' },
  { level: 'warn' as const, template: 'High memory usage detected: {memory}MB' },
  { level: 'error' as const, template: 'Failed to connect to database {database}' },
  { level: 'info' as const, template: 'Cache hit for key {key}' },
  { level: 'debug' as const, template: 'Processing batch {batch} with {count} items' },
  { level: 'warn' as const, template: 'Slow query detected: {query} took {time}ms' },
  { level: 'info' as const, template: 'API call to {service} returned status {status}' },
  { level: 'error' as const, template: 'Authentication failed for user {user}' },
  { level: 'info' as const, template: 'File {filename} uploaded successfully' },
]

const SAMPLE_DATA = {
  user: ['alice', 'bob', 'charlie', 'diana', 'evan'],
  ip: ['192.168.1.100', '10.0.0.42', '172.16.5.23', '192.168.1.101'],
  endpoint: ['/api/users', '/api/products', '/api/orders', '/api/auth'],
  time: ['45', '123', '67', '234', '89', '456'],
  memory: ['512', '768', '1024', '1536', '2048'],
  database: ['postgres-primary', 'postgres-replica', 'mongodb-cluster'],
  key: ['user:1234', 'session:5678', 'product:9012'],
  batch: ['batch-001', 'batch-002', 'batch-003'],
  count: ['10', '25', '50', '100'],
  query: ['SELECT * FROM users', 'UPDATE orders', 'INSERT INTO logs'],
  service: ['payment-service', 'email-service', 'notification-service'],
  status: ['200', '201', '400', '404', '500'],
  filename: ['report.pdf', 'image.png', 'data.csv', 'config.json'],
}

function replacePlaceholders(template: string): string {
  let message = template
  const placeholderRegex = /{(\w+)}/g
  let match

  while ((match = placeholderRegex.exec(template)) !== null) {
    const key = match[1] as keyof typeof SAMPLE_DATA
    const values = SAMPLE_DATA[key]
    if (values) {
      const randomValue = values[Math.floor(Math.random() * values.length)]
      message = message.replace(match[0], randomValue)
    }
  }

  return message
}

export function generateLogEntry(): LogEntry {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  return {
    timestamp: Date.now(),
    message: replacePlaceholders(template.template),
    level: template.level,
  }
}
