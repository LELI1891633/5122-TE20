<template>
  <div class="hero">
    <div class="hero-inner">
      <h1>Trends</h1>
      <p class="sub">Get insights into parking patterns over time in different areas</p>
    </div>
  </div>
  <div class="tr-container">
    <section class="white-card">
      <h2>Select Area and Time of Day</h2>
      <div class="form-grid">
        <label>Search Area</label>
        <select v-model="area">
          <option>Melbourne CBD</option>
          <option>Docklands</option>
          <option>Southbank</option>
        </select>
        <label>Select Start Year</label>
        <input type="number" min="2011" max="2021" v-model.number="startYear" />
        <label>Select End Year</label>
        <input type="number" min="2011" max="2021" v-model.number="endYear" />
      </div>
      <div style="margin:8px 0 14px;">
        <button class="btn" @click="apply">Apply</button>
      </div>
      <h3>Parking Demand over time</h3>
      <div class="chips">
        <button class="chip" :class="{ active: metric === 'vehicle' }" @click="metric = 'vehicle'; renderChart()">Vehicle
          Growth</button>
        <button class="chip" :class="{ active: metric === 'population' }"
          @click="metric = 'population'; renderChart()">Population Growth</button>
        <button class="chip" :class="{ active: metric === 'congestion' }"
          @click="metric = 'congestion'; renderChart()">Sign Plates</button>
      </div>
    </section>
    <section class="chart-board">
      <div class="inner-white">
        <canvas ref="canvasEl" height="160"></canvas>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">

import { onMounted, ref } from 'vue'

import { Chart } from 'chart.js/auto'

const area = ref('Melbourne CBD')

const startYear = ref<number>(2016)

const endYear = ref<number>(2021)

type Metric = 'vehicle' | 'population' | 'congestion'

const metric = ref<Metric>('vehicle')

const canvasEl = ref<HTMLCanvasElement | null>(null)

let chart: Chart | null = null

onMounted(() => { renderChart() })

// Apply filters and re-render chart

function apply() { renderChart() }

async function renderChart() {

  if (!canvasEl.value) return

  try {

    const { labels, values } = await loadMetricData()

    chart?.destroy()

    chart = new Chart(canvasEl.value, {

      type: 'bar',

      data: { labels, datasets: [{ data: values }] },

      options: {

        responsive: true,

        plugins: { legend: { display: false } },

        scales: { x: { display: true }, y: { display: true } },

      }

    })

  } catch (e) {

    // fallback to empty chart

    chart?.destroy()

    chart = new Chart(canvasEl.value, {

      type: 'bar',

      data: { labels: [], datasets: [{ data: [] }] },

      options: { responsive: true, plugins: { legend: { display: false } } }

    })

  }

}

async function loadMetricData(): Promise<{ labels: string[]; values: number[] }> {

  if (metric.value === 'vehicle') return await fetchVehicleOwnership()

  if (metric.value === 'population') return await fetchPopulation()

  return await fetchSignPlates()

}

async function fetchVehicleOwnership(): Promise<{ labels: string[]; values: number[] }> {

  const res = await fetch('/api/trends/vehicle-ownership')

  const data = await res.json() as { rows: any[] }

  const rows = data?.rows ?? []

  // Prefer national row ('Aust.') then Victoria ('Vic.'), else first valid row

  const pick = rows.find(r => r.state === 'Aust.')

    || rows.find(r => (r.state ?? '').toLowerCase().startsWith('vic'))

    || rows.find(r => r.state)

  if (!pick) return { labels: [], values: [] }

  // Map base year (2016..2020) to column keys and labels, then filter by selected year range

  const pairs = [

    { year: 2016, key: 'no_2016_2017', label: '2016-17' },

    { year: 2017, key: 'no_2017_2018', label: '2017-18' },

    { year: 2018, key: 'no_2018_2019', label: '2018-19' },

    { year: 2019, key: 'no_2019_2020', label: '2019-20' },

    { year: 2020, key: 'no_2020_2021', label: '2020-21' },

  ]

  const from = Math.max(2016, Math.min(startYear.value, endYear.value))

  const to = Math.min(2020, Math.max(startYear.value, endYear.value))

  const sel = pairs.filter(p => p.year >= from && p.year <= to)

  return {

    labels: sel.map(p => p.label),

    values: sel.map(p => Number(pick[p.key] ?? 0)),

  }

}

async function fetchPopulation(): Promise<{ labels: string[]; values: number[] }> {

  // Map UI area to state name; Melbourne areas fall under Victoria

  const st_name = 'Victoria'

  const res = await fetch(`/api/trends/population?st_name=${encodeURIComponent(st_name)}&limit=1000`)

  const data = await res.json() as { rows: any[] }

  const rows = data?.rows ?? []

  // Prefer Greater Melbourne row, else first Victoria row

  const pick = rows.find(r => r.GCCSA_name === 'Greater Melbourne') || rows[0]

  if (!pick) return { labels: [], values: [] }

  const from = Math.max(2011, Math.min(startYear.value, endYear.value))

  const to = Math.min(2021, Math.max(startYear.value, endYear.value))

  const labels: string[] = []

  const values: number[] = []

  for (let y = from; y <= to; y++) {

    const key = `erp_${y}`

    labels.push(String(y))

    values.push(Number(pick[key] ?? 0))

  }

  return { labels, values }

}

async function fetchSignPlates(): Promise<{ labels: string[]; values: number[] }> {


  const res = await fetch('/api/trends/sign-plates?limit=1000')

  const data = await res.json() as { rows: any[] }

  const rows = data?.rows ?? []

  const counts: Record<string, number> = {}

  for (const r of rows) {

    const key = String((r.Restriction_Display ?? '').trim())

    if (!key) continue

    counts[key] = (counts[key] ?? 0) + 1

  }

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const labels = entries.map(e => e[0])

  const values = entries.map(e => e[1])

  return { labels, values }

}
</script>
<style scoped>
/* Top banner */

.hero {
  background: linear-gradient(135deg, #9196fc, #8f94fb);
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 16px 24px;
  text-align: center;
}

.hero h1 {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 8px;
  color: #fff;
}


.sub {
  margin: 0;
  color: #fff;
  font-size: 18px;
  opacity: 0.95;
}



.tr-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}



.white-card {

  background: #fff;
  border: 1px solid #dedede;
  border-radius: 4px;
  padding: 22px;
  margin-bottom: 16px;

  text-align: center;
  color: #4e54c8;

}

.white-card h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 14px;
  color: #4e54c8;
}

.form-grid {

  margin: 0 auto 10px;
  max-width: 720px;

  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px 16px;
  align-items: center;

}

.form-grid label {
  text-align: right;
  font-weight: 600;
  color: #4e54c8;
}

.form-grid select,
.form-grid input {

  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background: #fff;
  color: #4e54c8;

}

.btn {

  padding: 8px 14px;
  border: 1px solid #bdbdbd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  color: #4e54c8;

}

.white-card h3 {
  font-size: 24px;
  font-weight: 800;
  margin: 18px 0 10px;
  color: #4e54c8;
}

.chips {
  display: flex;
  gap: 18px;
  justify-content: center;
}

.chip {

  background: #fff;
  border: 1px solid #bdbdbd;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  color: #4e54c8;

}

.chip.active {
  background: #4e54c8;
  color: #fff;
  border-color: #4e54c8;
}



.chart-board {

  background: #f9f9ff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 28px;
  min-height: 360px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  color: #4e54c8;

}

.inner-white {

  width: 80%;
  height: 220px;
  background: #fff;
  border-radius: 2px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;

}



@media (max-width: 900px) {

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid label {
    text-align: left;
  }

  .inner-white {
    width: 100%;
  }

}
</style>