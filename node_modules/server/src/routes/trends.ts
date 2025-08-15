import { Router } from 'express'
import TrendService from '../services/trendService.js'
export const trendsRouter = Router()
const trendService = new TrendService()
trendsRouter.get('/', (_req, res) => {
  const hours = Array.from({ length: 24 }).map((_, h) => h)
  const series = ['Melbourne CBD', 'Docklands', 'Southbank'].map((area) => ({
    area,
    values: hours.map((h) =>
      Math.round(
        100 -
          (Math.sin((h / 24) * Math.PI * 2) * 30 + Math.random() * 10 + (area === 'Docklands' ? 5 : 0))
      )
    ),
  }))
  res.json({ hours, series })
})
trendsRouter.get('/vehicle-ownership', async (req, res) => {
  try {
    const state = req.query.state as string | undefined
    const rows = await trendService.getVehicleOwnershipGrowth({ state })
    res.json({ rows })
  } catch (error: any) {
    res.status(500).json({ error: { code: 'DatabaseError', message: error.message } })
  }
})
trendsRouter.get('/population', async (req, res) => {
  try {
    const st_code = req.query.st_code ? Number(req.query.st_code) : undefined
    const st_name = req.query.st_name as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const rows = await trendService.getPopulationGrowth({ st_code, st_name, limit })
    res.json({ rows })
  } catch (error: any) {
    res.status(500).json({ error: { code: 'DatabaseError', message: error.message } })
  }
})
trendsRouter.get('/sign-plates', async (req, res) => {
  try {
    const zone = (req.query.zone as string | undefined) ?? undefined
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const rows = await trendService.getSignPlatesByZone({ zone, limit })
    res.json({ rows })
  } catch (error: any) {
    res.status(500).json({ error: { code: 'DatabaseError', message: error.message } })
  }
})
