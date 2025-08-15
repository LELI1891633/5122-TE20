import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { errorHandler } from './middlewares/error-handler.js'
import { notFound } from './middlewares/not-found.js'
import { realtimeRouter } from './routes/realtime.js'
import { trendsRouter } from './routes/trends.js'


const app = express()

// Security & Logging
app.use(helmet())
app.use(cors({ origin: config.corsOrigin }))
app.use(morgan('dev'))
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)



// API Routes
app.use('/api/realtime', realtimeRouter)
app.use('/api/trends', trendsRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`API on http://localhost:${config.port}`)
})

process.on('uncaughtException', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Please close other processes using this port and restart the server.`)
    process.exit(1)
  } else {
    console.error('Uncaught Exception:', err)
    process.exit(1)
  }
})


