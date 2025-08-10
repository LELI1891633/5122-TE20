import { Router } from 'express'
import { validate } from '../utils/validate.js'
import { z } from 'zod'

export const realtimeRouter = Router()

const realtimeQuerySchema = z.object({
  query: z.object({
    area: z.enum(['Melbourne CBD', 'Docklands', 'Southbank']).default('Melbourne CBD'),
    hour: z.coerce.number().min(0).max(23).default(12),
    demand: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  })
})

realtimeRouter.get('/spots', validate(realtimeQuerySchema), (req, res) => {
  const { area, hour, demand } = (req.query as any) as z.infer<typeof realtimeQuerySchema>['query']
  const spots = Array.from({ length: 20 }).map((_, i) => ({
    id: `spot-${i + 1}`,
    lat: -37.81 + Math.random() * 0.02,
    lng: 144.96 + Math.random() * 0.02,
    occupied: Math.random() > 0.5,
  }))
  res.json({ area, hour, demand, spots })
})
