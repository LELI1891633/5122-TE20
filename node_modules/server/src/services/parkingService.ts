import { pool } from '../config/database.js'

export class ParkingService {
  // Test database connection
  async testConnection() {
    try {
      const [rows] = await pool.execute('SELECT 1 as test') as any[];
      return { success: true, data: rows };
    } catch (error: any) {
      console.error('Database connection test failed:', error);
      return { success: false, error: (error as any).message };
    }
  }

  // Get all available parking zones
  async getAvailableZones() {
    try {
      const [rows] = await pool.execute(`
        SELECT DISTINCT 
          z.ParkingZone as zoneNumber,
          z.OnStreet as streetName,
          z.StreetFrom,
          z.StreetTo
        FROM parking_zones_street_segments z
        ORDER BY z.ParkingZone
      `) as any[];
      
      return rows.map((row: any) => ({
        zoneNumber: row.zoneNumber,
        streetName: row.streetName,
        streetFrom: row.StreetFrom,
        streetTo: row.StreetTo
      }))
    } catch (error: any) {
      console.error('Error getting available zones:', error);
      return [];
    }
  }

  // Get real-time parking spots data based on demand level
  async getRealTimeSpots(area: string, hour: number, demand: string) {
    try {
      let zones = [area]
      let timeRange = [hour]
      
      // Get adjacent zones for Medium and High demand
      if (demand === 'Medium' || demand === 'High') {
        const adjacentZones = await this.getAdjacentZones(area)
        zones = [...zones, ...adjacentZones]
      }
      
      // Extend time range for High demand (current hour ± 1)
      if (demand === 'High') {
        timeRange = [Math.max(0, hour - 1), hour, Math.min(23, hour + 1)]
      }
      
      console.log(`Querying zones: ${zones.join(', ')}, hours: ${timeRange.join(', ')}, demand: ${demand}`)
      
      // First check if the requested area has any sensors
      const [areaCheck] = await pool.execute(`
        SELECT COUNT(*) as count FROM parking_bay_sensors WHERE Zone_Number = ?
      `, [area]) as any[];
      
      const hasSensors = areaCheck[0]?.count > 0
      
      if (!hasSensors) {
        // If no sensors in requested area, try to find nearby zones with sensors
        const [nearbyZones] = await pool.execute(`
          SELECT DISTINCT s.Zone_Number
          FROM parking_bay_sensors s
          WHERE s.Latitude IS NOT NULL 
            AND s.Longitude IS NOT NULL
            AND s.Latitude != 0 
            AND s.Longitude != 0
          ORDER BY ABS(s.Zone_Number - ?)
          LIMIT 5
        `, [area]) as any[];
        
        if (nearbyZones.length > 0) {
          zones = nearbyZones.map((row: any) => row.Zone_Number)
          console.log(`No sensors in area ${area}, using nearby zones: ${zones.join(', ')}`)
        }
      }
      
      // Query all sensors for the zone(s) without time filtering first
      const [rows] = await pool.execute(`
        SELECT 
          s.sensor_id,
          s.Zone_Number,
          s.Status_Description,
          s.Latitude,
          s.Longitude,
          s.Lastupdated_Date,
          s.Lastupdated_Time,
          z.OnStreet,
          z.StreetFrom,
          z.StreetTo
        FROM parking_bay_sensors s
        LEFT JOIN parking_zones_street_segments z 
          ON s.Zone_Number = z.ParkingZone
        WHERE s.Zone_Number IN (${zones.map(() => '?').join(',')})
          AND s.Latitude IS NOT NULL 
          AND s.Longitude IS NOT NULL
          AND s.Latitude != 0 
          AND s.Longitude != 0
        ORDER BY s.Lastupdated_Date DESC, s.Lastupdated_Time DESC
        LIMIT 200
      `, zones) as any[];
      
      console.log(`Found ${rows.length} spots for area ${area}, hour ${hour}, demand ${demand}`)
      
      // Transform database rows to frontend expected format
      const spots = rows.map((row: any) => ({
        id: `spot-${row.sensor_id}`,
        lat: Number(row.Latitude),
        lng: Number(row.Longitude),
        occupied: this.isOccupied(row.Status_Description),
        zone: row.Zone_Number,
        street: row.OnStreet || 'Unknown Street',
        streetFrom: row.StreetFrom,
        streetTo: row.StreetTo,
        lastUpdated: `${row.Lastupdated_Date} ${row.Lastupdated_Time}`
      }))
      
      return {
        area,
        hour,
        demand,
        spots,
        totalSpots: spots.length,
        availableSpots: spots.filter((s: any) => !s.occupied).length,
        occupiedSpots: spots.filter((s: any) => s.occupied).length
      }
    } catch (error: any) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch parking spots')
    }
  }


  async getAdjacentZones(zoneNumber: string) {
    try {
      // Find zones that share street connections with the current zone
      const [rows] = await pool.execute(`
        SELECT DISTINCT z2.ParkingZone as adjacentZone
        FROM parking_zones_street_segments z1
        JOIN parking_zones_street_segments z2 ON 
          (z1.OnStreet = z2.OnStreet AND z1.ParkingZone != z2.ParkingZone)
          OR (z1.StreetFrom = z2.OnStreet OR z1.StreetTo = z2.OnStreet)
          OR (z2.StreetFrom = z1.OnStreet OR z2.StreetTo = z1.OnStreet)
        WHERE z1.ParkingZone = ?
        LIMIT 5
      `, [zoneNumber]) as any[];
      
      return rows.map((row: any) => row.adjacentZone)
    } catch (error: any) {
      console.error('Error getting adjacent zones:', error)
      return []
    }
  }

  // Get parking zone statistics
  async getZoneStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          s.Zone_Number,
          COUNT(*) as total_sensors,
          SUM(CASE WHEN s.Status_Description = 'Present' THEN 1 ELSE 0 END) as occupied_count,
          z.OnStreet as street_name
        FROM parking_bay_sensors s
        LEFT JOIN parking_zones_street_segments z ON s.Zone_Number = z.ParkingZone
        GROUP BY s.Zone_Number, z.OnStreet
        ORDER BY s.Zone_Number
      `) as any[];
      
      return rows
    } catch (error: any) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch zone stats')
    }
  }

  // Determine if parking spot is occupied based on status description
  private isOccupied(statusDescription: string): boolean {
    if (!statusDescription) return false
    
    // Based on actual database values: 'Present' = occupied, 'Unoccupied' = available
    return statusDescription === 'Present'
  }
}
