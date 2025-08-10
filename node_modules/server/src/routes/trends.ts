import { Router } from 'express'

export const trendsRouter = Router()

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

