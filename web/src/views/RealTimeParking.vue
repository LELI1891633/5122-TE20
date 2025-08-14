<template>
  <div class="realtime-page">
    <div class="map-container">
      <div ref="mapEl" class="map"></div>
      <div v-if="errorMsg" class="map-error">{{ errorMsg }}</div>
      
      <div class="map-overlay-info">
        <div class="info-badge">
          <span class="info-label">AVAILABILITY</span>
          <span class="info-label">LOCATION</span>
          <span class="info-label">SIGN PLATE</span>
        </div>
      </div>
    </div>

    <div class="legend-panel">
      <h3>LEGEND</h3>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-dot available"></div>
          <span>AVAILABLE</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot occupied"></div>
          <span>OCCUPIED</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot unknown"></div>
          <span>UNKNOWN</span>
        </div>
      </div>
    </div>

    <div class="control-panel">
      <div class="panel-header">
        <div class="header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2>LIVE MAP VISUALIZATION OF<br/>REAL-TIME AVAILABILITY</h2>
        <p>SELECT AREA</p>
      </div>

      <div class="form-group">
        <select v-model="areaInput" @change="onAreaChange" class="select-field">
          <option value="">Select area...</option>
          <option v-for="zone in zones" :key="`${zone.zoneNumber}-${zone.streetName}`" :value="zone.zoneNumber">
            {{ zone.streetName }} (Zone {{ zone.zoneNumber }})
          </option>
        </select>
        <div v-if="areaError" class="error-message">{{ areaError }}</div>
      </div>

      <div class="form-group">
        <h3>SELECT ARRIVAL TIME</h3>
        <div class="time-display">
          <input class="time-slider" type="range" min="0" max="23" v-model.number="hour" />
          <div class="time-label">{{ formatHour(hour) }}</div>
        </div>
      </div>

      <button class="search-btn" @click="onSearch">SEARCH NOW</button>
    </div>

    <div class="disclaimer-section">
      <div class="disclaimer-content">
        <div class="disclaimer-left">
          <h4>Data sources and Disclaimer</h4>
          <p>We use open-source data and predictive analysis to estimate parking availability, though accuracy may vary by source and update frequency.</p>
        </div>
        <div class="disclaimer-right">
          <h4>Privacy and permissions</h4>
          <p>The app estimates parking from public data and no location tracking needed.</p>
        </div>
        <div class="disclaimer-center">
          <h4>Live Map Features</h4>
          <p>Interactive map with real-time parking data, legend indicators, and area selection controls for optimal parking experience.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const area = ref<string>('')
const areaInput = ref<string>('')
const areaError = ref<string>('')
const hour = ref<number>(15)
const demand = ref<string>('Medium')
const errorMsg = ref('')
const zones = ref<Array<{zoneNumber: string, streetName: string}>>([])

async function loadZones() {
  try {
    const res = await fetch('/api/realtime/zones')
    if (res.ok) {
      const data = await res.json()
      zones.value = data.zones
    }
  } catch (e) {
    console.error('Failed to load zones:', e)
  }
}

function onAreaChange() {
  areaError.value = ''
  area.value = areaInput.value
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

async function onSearch(){
  errorMsg.value = ''
  if (!area.value) {
    areaError.value = 'Please select an area'
    return
  }
  await loadSpots()
}

const mapEl = ref<HTMLDivElement|null>(null)
let map: L.Map | null = null
let ro: ResizeObserver | null = null
let layerGroup: L.LayerGroup | null = null

onMounted(async () => {
  await loadZones()
  
  await nextTick()
  if (!mapEl.value) return
  map = L.map(mapEl.value, { zoomControl: true, scrollWheelZoom: true })
    .setView([-37.8136, 144.9631], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    detectRetina: true
  }).addTo(map)
  layerGroup = L.layerGroup().addTo(map)
  
  requestAnimationFrame(() => {
    map!.invalidateSize()
    requestAnimationFrame(() => map!.invalidateSize())
  })

  ro = new ResizeObserver(() => map?.invalidateSize())
  ro.observe(mapEl.value)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ro?.disconnect(); ro = null
})

function handleResize(){
  setTimeout(() => map?.invalidateSize(), 80)
}

type SpotsResp = { area: string; hour: number; demand: string; spots: { id:string; lat:number; lng:number; occupied:boolean }[] }
async function loadSpots(){
  try{
    if (!map) return
    const params = new URLSearchParams({ area: area.value, hour: String(hour.value), demand: demand.value })
    
    const res = await fetch(`/api/realtime/spots?${params.toString()}`)
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json() as SpotsResp
    
    renderSpots(data.spots)
  }catch(e:any){
    console.error('Error loading spots:', e)
    errorMsg.value = e?.message ?? 'Failed to load spots'
  }
}

function renderSpots(spots: { id:string; lat:number; lng:number; occupied:boolean }[]){
  if (!map || !layerGroup) return
  
  layerGroup.clearLayers()
  
  if (spots.length === 0) return
  
  for (const s of spots){
    const marker = L.circleMarker([s.lat, s.lng], {
      radius: 8,
      color: s.occupied ? '#EF4444' : '#10B981',
      weight: 2,
      fillOpacity: 0.8,
      fillColor: s.occupied ? '#EF4444' : '#10B981'
    })
    
    marker.bindTooltip(s.occupied ? 'Occupied' : 'Available', {
      permanent: false,
      direction: 'top'
    })
    
    marker.addTo(layerGroup)
  }
  
  flyToArea(spots)
}

function flyToArea(spots: { id:string; lat:number; lng:number; occupied:boolean }[]) {
  if (!map || spots.length === 0) return
  
  try {
    const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]))
    
    map.fitBounds(bounds, { 
      padding: [20, 20],
      maxZoom: 16,
      animate: true
    })
  } catch (error) {
    console.error('Error flying to area:', error)
  }
}
</script>

<style scoped>
.realtime-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-top: 80px;
  background: rgba(255, 0, 0, 0.1);
}

.map-container {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  z-index: 1;
  background: #f0f0f0;
  overflow: hidden;
  pointer-events: none;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  position: relative;
  pointer-events: auto;
}

.map :deep(.leaflet-container) {
  width: 100% !important;
  height: 100% !important;
  background: #f0f0f0;
}

.map :deep(.leaflet-tile-pane) {
  z-index: 1;
}

.map :deep(.leaflet-overlay-pane) {
  z-index: 2;
}

.map :deep(img) {
  max-width: none !important;
}

.map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--danger-red);
  background: var(--text-white);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
}



/* Map overlay info (top left) */
.map-overlay-info {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: var(--text-white);
  padding: 12px 16px;
  border-radius: 20px;
  border: 2px solid var(--text-white);
  z-index: 15;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.info-badge {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.legend-panel {
  position: absolute;
  bottom: 300px;
  left: 20px;
  background: #6B46C1 !important;
  color: #FFFFFF !important;
  padding: 20px;
  border-radius: 20px;
  z-index: 100;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.legend-panel h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-dot.available {
  background: #10B981 !important;
}

.legend-dot.occupied {
  background: #EF4444 !important;
}

.legend-dot.unknown {
  background: #F59E0B !important;
}

.control-panel {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 350px;
  background: #6B46C1 !important;
  color: #FFFFFF !important;
  padding: 24px;
  border-radius: 20px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.panel-header {
  text-align: center;
  margin-bottom: 24px;
}

.header-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.panel-header h2 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.panel-header p {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.form-group {
  margin-bottom: 24px;
}

.form-group h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
}

.select-field {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--text-white);
  color: var(--text-dark);
  font-size: 14px;
}

.error-message {
  color: #FCA5A5;
  font-size: 12px;
  margin-top: 4px;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-slider {
  width: 100%;
  accent-color: var(--accent-orange);
}

.time-label {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 8px;
}

.search-btn {
  width: 100%;
  background: var(--text-white);
  color: var(--text-dark);
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #F3F4F6;
  transform: translateY(-2px);
}

.disclaimer-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #6B46C1 !important;
  color: #FFFFFF !important;
  z-index: 100;
  border-radius: 30px 30px 0 0;
  padding: 24px 20px;
  min-height: 120px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.disclaimer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.disclaimer-left h4,
.disclaimer-right h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.disclaimer-left p,
.disclaimer-right p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
}

@media (max-width: 1200px) {
  .control-panel {
    width: 300px;
    right: 10px;
  }
  
  .disclaimer-content {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .realtime-page {
    padding-top: 120px;
  }
  
  .map-container {
    top: 120px;
    height: calc(100vh - 120px);
  }
  
  .control-panel {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 280px;
    padding: 20px;
    border-radius: 20px;
  }
  
  .legend-panel {
    bottom: 250px;
    left: 10px;
    min-width: 150px;
    padding: 16px;
    border-radius: 20px;
  }
  
  .legend-items {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .legend-item {
    gap: 8px;
  }
  
  .legend-dot {
    width: 14px;
    height: 14px;
  }
  
  .map-overlay-info {
    top: 20px;
    left: 10px;
    padding: 8px 12px;
    border-radius: 16px;
  }
  
  .info-label {
    font-size: 10px;
  }
  
  .disclaimer-section {
    padding: 20px 16px;
    border-radius: 24px 24px 0 0;
  }
  
  .disclaimer-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .disclaimer-left h4,
  .disclaimer-right h4,
  .disclaimer-center h4 {
    font-size: 15px;
  }
  
  .disclaimer-left p,
  .disclaimer-right p,
  .disclaimer-center p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .realtime-page {
    padding-top: 140px;
  }
  
  .map-container {
    top: 140px;
    height: calc(100vh - 140px);
  }
  
  .control-panel {
    width: 260px;
    right: 8px;
    padding: 16px;
    border-radius: 18px;
  }
  
  .panel-header h2 {
    font-size: 14px;
  }
  
  .form-group h3 {
    font-size: 14px;
  }
  
  .select-field {
    padding: 10px;
    font-size: 14px;
  }
  
  .time-label {
    font-size: 20px;
  }
  
  .search-btn {
    padding: 14px;
    font-size: 15px;
  }
  
  .legend-panel {
    bottom: 220px;
    left: 8px;
    min-width: 140px;
    padding: 14px;
    border-radius: 18px;
  }
  
  .legend-panel h3 {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .legend-items {
    gap: 6px;
  }
  
  .legend-item {
    gap: 6px;
  }
  
  .legend-dot {
    width: 12px;
    height: 12px;
  }
  
  .map-overlay-info {
    left: 8px;
    padding: 6px 10px;
    border-radius: 14px;
  }
  
  .info-label {
    font-size: 9px;
  }
  
  .disclaimer-section {
    padding: 16px 12px;
    border-radius: 20px 20px 0 0;
  }
  
  .disclaimer-content {
    gap: 12px;
  }
  
  .disclaimer-left h4,
  .disclaimer-right h4,
  .disclaimer-center h4 {
    font-size: 14px;
  }
  
  .disclaimer-left p,
  .disclaimer-right p,
  .disclaimer-center p {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .realtime-page {
    padding-top: 150px;
  }
  
  .map-container {
    top: 150px;
    height: calc(100vh - 150px);
  }
  
  .control-panel {
    width: 240px;
    right: 6px;
    padding: 14px;
    border-radius: 16px;
  }
  
  .panel-header h2 {
    font-size: 13px;
  }
  
  .form-group h3 {
    font-size: 13px;
  }
  
  .select-field {
    padding: 8px;
    font-size: 13px;
  }
  
  .time-label {
    font-size: 18px;
  }
  
  .search-btn {
    padding: 12px;
    font-size: 14px;
  }
  
  .legend-panel {
    bottom: 200px;
    left: 6px;
    min-width: 130px;
    padding: 12px;
    border-radius: 16px;
  }
  
  .legend-panel h3 {
    font-size: 15px;
  }
  
  .map-overlay-info {
    left: 6px;
    padding: 5px 8px;
    border-radius: 12px;
  }
  
  .info-label {
    font-size: 8px;
  }
  
  .disclaimer-section {
    padding: 14px 10px;
    border-radius: 18px 18px 0 0;
  }
  
  .disclaimer-content {
    gap: 10px;
  }
  
  .disclaimer-left h4,
  .disclaimer-right h4,
  .disclaimer-center h4 {
    font-size: 13px;
  }
  
  .disclaimer-left p,
  .disclaimer-right p,
  .disclaimer-center p {
    font-size: 11px;
  }
}
</style>
