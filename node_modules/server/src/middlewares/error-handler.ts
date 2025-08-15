import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500
  const code = err.code ?? 'InternalError'
  const message = err.message ?? 'Unexpected error'
  if (process.env.NODE_ENV !== 'test') console.error(err)
  res.status(status).json({ error: { code, message } })
}

