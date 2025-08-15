import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
  // Database configuration
  dbHost: process.env.DB_HOST ?? 'database-1.c2xk4m0ua3bz.us-east-1.rds.amazonaws.com',
  dbPort: Number(process.env.DB_PORT ?? 3306),
  dbUser: process.env.DB_USER ?? 'admin',
  dbPassword: process.env.DB_PASSWORD ?? 'Te20-tEAMDB',
  dbName: process.env.DB_NAME ?? 'parking_data',
}

