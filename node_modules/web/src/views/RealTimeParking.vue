<template>
  <div class="hero">
    <div class="hero-inner">
      <h1>Real-Time Parking</h1>
    </div>
  </div>

  <div class="rt-container">
    <!-- Left panel: interactive map inside black board -->
    <section class="board">
      <p class="board-title">Live map visualisation of Real-Time availability</p>
      <div class="illustration">
        <div ref="mapEl" class="map-layer"></div>
      </div>
      <p class="board-sub">
        View available spots in real-time by time of day, area and current demand
      </p>
      <div class="board-actions">
        <button class="btn-outline" @click="onRefresh">Refresh Spots</button>
        <button class="btn-outline" @click="onLocate">Detect my location</button>
      </div>
    </section>

    <!-- 右侧筛选 -->
    <aside class="filter">
      <h2>Select Area</h2>
      <select class="select" v-model="area">
        <option>Melbourne CBD</option>
        <option>Docklands</option>
        <option>Southbank</option>
      </select>

      <h3>Time of Day</h3>
      <input class="range" type="range" min="0" max="23" v-model.number="hour" />

      <h3>Demand Level</h3>
      <div class="btn-group">
        <button class="chip" :class="{active: demand==='High'}" @click="demand='High'">High</button>
        <button class="chip" :class="{active: demand==='Medium'}" @click="demand='Medium'">Medium</button>
        <button class="chip" :class="{active: demand==='Low'}" @click="demand='Low'">Low</button>
      </div>

      <button class="btn-primary" @click="onSearch">Search Now</button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Demand = 'High'|'Medium'|'Low'
const area   = ref<'Melbourne CBD'|'Docklands'|'Southbank'>('Melbourne CBD')
const hour   = ref<number>(12)
const demand = ref<Demand>('Medium')

function onSearch(){}
function onRefresh(){}
function onLocate(){}

// Map container ref and lifecycle
const mapEl = ref<HTMLDivElement|null>(null)
let map: L.Map | null = null
let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  if (!mapEl.value) return
  map = L.map(mapEl.value, { zoomControl: true, scrollWheelZoom: true })
    .setView([-37.8136, 144.9631], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    detectRetina: true
  }).addTo(map)
  // Double refresh to avoid tile glitches on first paint
  requestAnimationFrame(() => {
    map!.invalidateSize()
    requestAnimationFrame(() => map!.invalidateSize())
  })

  // Refresh map size when container/window changes
  ro = new ResizeObserver(() => map?.invalidateSize())
  ro.observe(mapEl.value)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ro?.disconnect(); ro = null
})

function handleResize(){
  // Light debounce
  setTimeout(() => map?.invalidateSize(), 80)
}
</script>

<style scoped>
/* Top banner */
.hero { background:#e6e6e6; }
.hero-inner { max-width:1100px; margin:0 auto; padding:40px 16px 24px; text-align:center; }
.hero h1 { font-size:56px; font-weight:900; margin:0; }

/* Two-column layout */
.rt-container {
  max-width:1100px; margin:0 auto; padding:24px 16px 60px;
  display:grid; grid-template-columns: 1fr 360px; gap:24px;
}

/* Left black board */
.board {
  background:#161616; color:#fff; border-radius:8px;
  padding:18px 18px 24px; display:flex; flex-direction:column; align-items:center;
}
.board-title { margin:6px 0 16px; font-weight:700; opacity:.95; }

/* Map board */
.illustration{
  width:100%; height:clamp(380px, 56vh, 640px);
  border-radius:4px; border:1px solid #333; background:#0e0e0e;
  position:relative; /* 为绝对定位的地图与覆盖层提供定位上下文 */
  display:flex; align-items:center; justify-content:center;
}
.map-layer{ position:absolute; inset:0; z-index:2; border-radius:4px; overflow:hidden; }

/* Leaflet adjustments: fill container and avoid image scaling issues */
.map-layer :deep(.leaflet-container){ width:100%; height:100%; background:transparent; }
.map-layer :deep(img){ max-width:none !important; }

.board-sub { margin:14px 0 10px; color:#cfcfcf; font-size:14px; text-align:center; }
.board-actions { display:flex; gap:18px; position:relative; z-index:1; }
.btn-outline{
  appearance:none; background:#fff; color:#000; border:1px solid #d8d8d8;
  padding:8px 16px; border-radius:4px; cursor:pointer;
}

/* Right filter card */
.filter{
  background:#0f0f0f; color:#fff; border-radius:4px; padding:22px 20px; height:fit-content;
}
.filter h2{ font-size:28px; margin:0 0 12px; font-weight:800; }
.filter h3{ margin:18px 0 8px; font-size:16px; font-weight:800; }
.select{
  width:100%; padding:8px 10px; border-radius:4px; border:1px solid #3a3a3a; background:#181818; color:#fff;
}
.range{ width:100%; accent-color:#7b6bd6; }

.btn-group{ display:flex; gap:12px; margin-bottom:18px; }
.chip{
  background:#fff; color:#000; border:1px solid #d8d8d8; padding:6px 12px; border-radius:4px; cursor:pointer;
}
.chip.active{ background:#111; color:#fff; border-color:#111; }
.btn-primary{
  width:100%; background:#fff; color:#000; border:1px solid #d8d8d8; padding:10px 0; border-radius:4px; cursor:pointer;
}
/* Responsive */
@media (max-width: 992px){
  .rt-container{ grid-template-columns: 1fr; }
}
</style>
