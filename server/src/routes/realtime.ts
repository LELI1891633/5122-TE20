import { Router } from 'express'
import { validate } from '../utils/validate.js'
import { z } from 'zod'
import { ParkingService } from '../services/parkingService.js'

export const realtimeRouter = Router()
const parkingService = new ParkingService()

// Test database connection endpoint
realtimeRouter.get('/test', async (_req, res) => {
  try {
    const result = await parkingService.testConnection()
    if (result.success) {
      res.json({ message: 'Database connection successful', data: result.data })
    } else {
      res.status(500).json({ error: 'Database connection failed', details: result.error })
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Database test failed', message: error.message })
  }
})

// Debug endpoint to check available data
realtimeRouter.get('/debug', async (req, res) => {
  try {
    const { area } = req.query
    console.log('Debug request for area:', area)
    
    // Check if the area exists in zones table
    const zones = await parkingService.getAvailableZones()
    const matchingZones = zones.filter((z: any) => 
      String(z.zoneNumber) === area || 
      z.streetName.toLowerCase().includes(String(area).toLowerCase())
    )
    
    // Check sensor data for this area
    const { pool } = await import('../config/database.js')
    const [sensorRows] = await pool.execute(`
      SELECT COUNT(*) as count, Zone_Number, Status_Description
      FROM parking_bay_sensors 
      WHERE Zone_Number = ?
      GROUP BY Zone_Number, Status_Description
    `, [area])
    
    // Check all available zones with sensors
    const [allSensors] = await pool.execute(`
      SELECT Zone_Number, COUNT(*) as sensor_count
      FROM parking_bay_sensors 
      GROUP BY Zone_Number
      ORDER BY sensor_count DESC
      LIMIT 10
    `)
    
    // Get sample sensor data for the requested area
    const [sampleSensors] = await pool.execute(`
      SELECT sensor_id, Zone_Number, Status_Description, Latitude, Longitude
      FROM parking_bay_sensors 
      WHERE Zone_Number = ?
      LIMIT 5
    `, [area])
    
    res.json({
      requestedArea: area,
      availableZones: zones.slice(0, 10), // First 10 zones
      matchingZones,
      sensorData: sensorRows,
      topZonesWithSensors: allSensors,
      sampleSensors,
      message: 'Debug endpoint working'
    })
  } catch (error: any) {
    res.status(500).json({ error: 'Debug failed', message: error.message })
  }
})

// Get all available parking zones
realtimeRouter.get('/zones', async (_req, res) => {
  try {
    const zones = await parkingService.getAvailableZones()
    res.json({ zones })
  } catch (error: any) {
    res.status(500).json({ 
      error: { 
        code: 'DatabaseError', 
        message: error.message 
      } 
    })
  }
})

// Search zones by street name
realtimeRouter.get('/search-zones', async (req, res) => {
  try {
    const { streetName } = req.query
    if (!streetName) {
      return res.status(400).json({ error: 'Street name is required' })
    }
    
    const zones = await parkingService.searchZonesByStreetName(String(streetName))
    res.json({ zones })
  } catch (error: any) {
    res.status(500).json({ 
      error: { 
        code: 'DatabaseError', 
        message: error.message 
      } 
    })
  }
})

// Query schema for real-time spots
const realtimeQuerySchema = z.object({
  query: z.object({
    area: z.string().default('7000'), // Changed to string to match Zone_Number
    hour: z.coerce.number().min(0).max(23).default(12),
    demand: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  })
})

// Get real-time parking spots
realtimeRouter.get('/spots', validate(realtimeQuerySchema), async (req, res) => {
  try {
    const { area, hour, demand } = (req.query as any) as z.infer<typeof realtimeQuerySchema>['query']
    const data = await parkingService.getRealTimeSpots(area, hour, demand)
    res.json(data)
  } catch (error: any) {
    res.status(500).json({ 
      error: { 
        code: 'DatabaseError', 
        message: error.message 
      } 
    })
  }
})

// Get parking zone statistics
realtimeRouter.get('/stats', async (_req, res) => {
  try {
    const stats = await parkingService.getZoneStats()
    res.json({ stats })
  } catch (error: any) {
    res.status(500).json({ 
      error: { 
        code: 'DatabaseError', 
        message: error.message 
      } 
    })
  }
})
