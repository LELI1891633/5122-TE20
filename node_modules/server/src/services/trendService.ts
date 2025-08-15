import { pool } from '../config/database.js'

export class TrendService {

    // Vehicle ownership growth (same columns as CSV; table: vehicle_ownership_growth)

    async getVehicleOwnershipGrowth(params?: { state?: string }) {

        const sql = `

      SELECT 

        state,

        no_2016_2017,

        percent_2016_2017,

        no_2017_2018,

        percent_2017_2018,

        no_2018_2019,

        percent_2018_2019,

        no_2019_2020,

        percent_2019_2020,

        no_2020_2021,

        percent_2020_2021,

        state_key

      FROM vehicle_ownership_growth

      ${params?.state ? 'WHERE state = ?' : ''}

      ORDER BY state_key

    `

        const args: any[] = []

        if (params?.state) args.push(params.state)

        const [rows] = await pool.execute(sql, args)

        return rows as any[]

    }

    // Population growth (same columns as CSV; table: population_growth)

    async getPopulationGrowth(params?: { st_code?: number; st_name?: string; limit?: number }) {

        const filters: string[] = []

        const args: any[] = []

        if (params?.st_code != null) { filters.push('ST_code = ?'); args.push(params.st_code) }

        if (params?.st_name) { filters.push('ST_name = ?'); args.push(params.st_name) }

        const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

        const limit = params?.limit && params.limit > 0 ? `LIMIT ${Number(params.limit)}` : ''

        const sql = `

      SELECT 

        population_key,

        ST_code,

        ST_name,

        GCCSA_code,

        GCCSA_name,

        erp_2001,erp_2002,erp_2003,erp_2004,erp_2005,erp_2006,erp_2007,erp_2008,erp_2009,erp_2010,

        erp_2011,erp_2012,erp_2013,erp_2014,erp_2015,erp_2016,erp_2017,erp_2018,erp_2019,erp_2020,erp_2021,

        ` +

            // trailing columns

            `\`2011-2021_no\`, \`2011-2021_%\`, Area, Population_density_2021

      FROM population_growth

      ${where}

      ORDER BY population_key

      ${limit}

    `

        const [rows] = await pool.execute(sql, args)

        return rows as any[]

    }

    // Parking sign plates by zone (same columns; table: sign_plates_parking_zone)

    async getSignPlatesByZone(params?: { zone?: string | number; limit?: number }) {

        const filters: string[] = []

        const args: any[] = []

        if (params?.zone != null) { filters.push('ParkingZone = ?'); args.push(params.zone) }

        const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

        const limit = params?.limit && params.limit > 0 ? `LIMIT ${Number(params.limit)}` : 'LIMIT 1000'

        const sql = `

      SELECT 

        ParkingZonePlates,

        ParkingZone,

        Restriction_Days,

        Time_Restrictions_Start,

        Time_Restrictions_Finish,

        TRIM(REPLACE(Restriction_Display, '\r', '')) AS Restriction_Display

      FROM sign_plates_parking_zone

      ${where}

      ORDER BY ParkingZonePlates

      ${limit}

    `

        const [rows] = await pool.execute(sql, args)

        return rows as any[]

    }

}

export default TrendService

