import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'parking-api', ts: new Date().toISOString() })
})

type Demand = 'High' | 'Medium' | 'Low'
type Spot = { id: string; lat: number; lng: number; occupied: boolean }

function generateSpots(
  area: string = 'Melbourne CBD',
  hour: number = 12,
  demand: Demand = 'Medium'
): Spot[] {
  const baseCount = demand === 'High' ? 20 : demand === 'Medium' ? 50 : 80
  const count = Math.max(
    10,
    Math.round(baseCount + Math.sin((hour / 24) * Math.PI * 2) * 10)
  )

  const [centerLat, centerLng] =
    area === 'Docklands'
      ? [-37.8139, 144.942]
      : area === 'Southbank'
      ? [-37.8226, 144.9643]
      : [-37.8136, 144.9631]

  return Array.from({ length: count }).map((_, i) => ({
    id: `${area}-${hour}-${i}`,
    lat: centerLat + (Math.random() - 0.5) * 0.01,
    lng: centerLng + (Math.random() - 0.5) * 0.01,
    occupied: Math.random() < (demand === 'High' ? 0.7 : demand === 'Medium' ? 0.5 : 0.3),
  }))
}

app.get('/api/realtime/spots', (req, res) => {
  const area = (req.query.area as string) ?? 'Melbourne CBD'
  const hour = Number(req.query.hour ?? 12)
  const demand = (req.query.demand as Demand) ?? 'Medium'
  const spots = generateSpots(area, hour, demand)
  res.json({ area, hour, demand, spots })
})

app.get('/api/trends', (_req, res) => {
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

app.get('/api/predictions', (req, res) => {
  const area = (req.query.area as string) ?? 'Melbourne CBD'
  const hour = Number(req.query.hour ?? 12)
  const predictedAvailable = Math.max(0, Math.round(80 - hour * 2 + Math.random() * 10))
  res.json({ area, hour, predictedAvailable })
})

type Settings = { preferredArea: string; notificationsEnabled: boolean }
let settings: Settings = { preferredArea: 'Melbourne CBD', notificationsEnabled: true }

app.get('/api/settings', (_req, res) => {
  res.json(settings)
})

app.post('/api/settings', (req, res) => {
  const { preferredArea, notificationsEnabled } = (req.body ?? {}) as Partial<Settings>
  if (typeof preferredArea === 'string') settings.preferredArea = preferredArea
  if (typeof notificationsEnabled === 'boolean') settings.notificationsEnabled = notificationsEnabled
  res.json(settings)
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})


