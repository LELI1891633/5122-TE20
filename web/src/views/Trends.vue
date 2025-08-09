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

        <label>Select Start Time</label>
        <input type="datetime-local" v-model="start" />

        <label>Select End Time</label>
        <input type="datetime-local" v-model="end" />
      </div>

      <div style="margin:8px 0 14px;">
        <button class="btn" @click="apply">Apply</button>
      </div>

      <h3>Parking Demand over time</h3>
      <div class="chips">
        <button class="chip" :class="{active: metric==='vehicle'}" @click="metric='vehicle'; renderChart()">Vehicle Growth</button>
        <button class="chip" :class="{active: metric==='population'}" @click="metric='population'; renderChart()">Population Growth</button>
        <button class="chip" :class="{active: metric==='congestion'}" @click="metric='congestion'; renderChart()">Congestion Zones</button>
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

const area  = ref('Melbourne CBD')
const start = ref<string>('')
const end   = ref<string>('')

type Metric = 'vehicle' | 'population' | 'congestion'
const metric = ref<Metric>('vehicle')

const canvasEl = ref<HTMLCanvasElement|null>(null)
let chart: Chart | null = null

onMounted(renderChart)

// Apply filters and re-render chart with basic demo data
function apply(){
  renderChart()
}

// Render or re-render the demo bar chart
function renderChart(){
  if (!canvasEl.value) return

  // Build simple 5-bar dataset; introduce slight area/time variation
  const seed = (area.value==='Docklands' ? 7 : area.value==='Southbank' ? 3 : 5)
  const timeFactor = (start.value || end.value) ? 1.1 : 1.0

  const base = {
    vehicle:    [12, 22, 38, 64, 80],
    population: [8,  14, 20, 28, 36],
    congestion: [10, 30, 45, 72, 90],
  }[metric.value].map((v,i)=> Math.round(v*timeFactor + (i%2?seed:-seed)))

  const labels = ['', '', '', '', '']

  chart?.destroy()
  chart = new Chart(canvasEl.value, {
    type: 'bar',
    data: { labels, datasets: [{ data: base }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
    }
  })
}
</script>

<style scoped>
/* Top banner */
.hero{ background:#e6e6e6; }
.hero-inner{ max-width:1100px; margin:0 auto; padding:40px 16px 24px; text-align:center; }
.hero h1{ font-size:56px; font-weight:900; margin:0 0 8px; }
.sub{ margin:0; color:#4a4a4a; font-size:18px; }

/* Container */
.tr-container{ max-width:1100px; margin:0 auto; padding:24px 16px 60px; }

/* White filter card */
.white-card{
  background:#fff; border:1px solid #dedede; border-radius:4px; padding:22px; margin-bottom:16px;
  text-align:center;
}
.white-card h2{ font-size:28px; font-weight:900; margin:0 0 14px; }
.form-grid{
  margin:0 auto 10px; max-width:720px;
  display:grid; grid-template-columns: 200px 1fr; gap:12px 16px; align-items:center;
}
.form-grid label{ text-align:right; font-weight:600; }
.form-grid select, .form-grid input{
  width:100%; padding:8px 10px; border:1px solid #d8d8d8; border-radius:4px; background:#fff;
}
.btn{
  padding:8px 14px; border:1px solid #bdbdbd; background:#fff; border-radius:4px; cursor:pointer;
}
.white-card h3{ font-size:28px; font-weight:900; margin:18px 0 10px; }
.chips{ display:flex; gap:18px; justify-content:center; }
.chip{
  background:#fff; border:1px solid #bdbdbd; padding:6px 14px; border-radius:4px; cursor:pointer;
}
.chip.active{ background:#111; color:#fff; border-color:#111; }

/* Black chart board */
.chart-board{
  background:#161616; border-radius:4px; padding:28px; min-height:360px;
  display:flex; align-items:center; justify-content:center;
}
.inner-white{
  width: 80%; height: 220px; background:#fff; border-radius:2px;
  display:flex; align-items:center; justify-content:center; padding:12px;
}

/* Responsive */
@media (max-width: 900px){
  .form-grid{ grid-template-columns: 1fr; }
  .form-grid label{ text-align:left; }
  .inner-white{ width:100%; }
}
</style>
