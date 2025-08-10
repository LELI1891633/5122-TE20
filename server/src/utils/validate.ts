import { ZodTypeAny } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validate = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse({ query: req.query, body: req.body })
    req.query = (parsed as any).query ?? req.query
    req.body = (parsed as any).body ?? req.body
    next()
  } catch (e: any) {
    e.status = 400
    e.code = 'BadRequest'
    next(e)
  }
}
