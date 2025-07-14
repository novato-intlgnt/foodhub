import client from 'prom-client'

// HTTP metrics
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status']
})

// WebSocket metrics
export const wsConnectionCounter = new client.Counter({
  name: 'websocket_connections_total',
  help: 'Total number of WebSocket connections'
})

export const wsMessageCounter = new client.Counter({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages received'
})

// Habilitar métricas de sistema (CPU, memoria, etc.)
client.collectDefaultMetrics()

export const register = client.register
