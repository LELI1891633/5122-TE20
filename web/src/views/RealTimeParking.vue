<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppFooter from '@/components/AppFooter.vue'

const area = ref<string>('')
const areaInput = ref<string>('')
const areaError = ref<string>('')
const hour = ref<number>(15)
const errorMsg = ref('')
const mapLoading = ref(true)
const searchLoading = ref(false)

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
    areaError.value = 'Please enter a street name'
    return
  }
  await loadSpots()
}

const mapEl = ref<HTMLDivElement|null>(null)
let map: L.Map | null = null
let ro: ResizeObserver | null = null
let layerGroup: L.LayerGroup | null = null

onMounted(async () => {
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
    requestAnimationFrame(() => {
      map!.invalidateSize()
      mapLoading.value = false
    })
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
  searchLoading.value = true
  try{
    if (!map) return
    const params = new URLSearchParams({ area: area.value, hour: String(hour.value), demand: 'Medium' }) // 移除demand参数
    
    const res = await fetch(`/api/realtime/spots?${params.toString()}`)
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json() as SpotsResp
    
    renderSpots(data.spots)
  }catch(e:any){
    console.error('Error loading spots:', e)
    errorMsg.value = e?.message ?? 'Failed to load spots'
  } finally {
    searchLoading.value = false
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
    
    marker.bindTooltip(`
      <div style="min-width: 200px;">
        <strong>Status:</strong> ${s.occupied ? 'Occupied' : 'Available'}<br>
        <strong>Location:</strong> ${s.lat.toFixed(6)}, ${s.lng.toFixed(6)}<br>
        <strong>Spot ID:</strong> ${s.id}<br>
        <strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}<br>
        <strong>Tip:</strong> ${s.occupied ? 'Try nearby streets for alternatives' : 'This spot is ready for parking'}
      </div>
    `, {
      permanent: false,
      direction: 'top',
      className: 'custom-tooltip'
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

<template>
  <div class="realtime-page">
    <div class="map-container">
      <div ref="mapEl" class="map"></div>
      
      <!-- Map Loading Overlay -->
      <div v-if="mapLoading" class="map-loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
      
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
        <h3>SELECT STREET NAME</h3>
        <input 
          v-model="areaInput" 
          @input="onAreaChange" 
          class="text-field" 
          placeholder="e.g. Collins Street, Bourke Street"
        />
        <div v-if="areaError" class="error-message">{{ areaError }}</div>
      </div>

      <div class="form-group">
        <h3>SELECT ARRIVAL TIME</h3>
        <div class="time-display">
          <input class="time-slider" type="range" min="0" max="23" v-model.number="hour" />
          <div class="time-label">{{ formatHour(hour) }}</div>
        </div>
      </div>

      <button class="search-btn" @click="onSearch" :disabled="searchLoading">
        <span v-if="!searchLoading">SEARCH NOW</span>
        <span v-else class="search-loading">
          <div class="btn-loading-spinner"></div>
          SEARCHING...
        </span>
      </button>

      <!-- Guidelines Section -->
      <div class="guidelines-section">
        <h3>GUIDELINES</h3>
        <ol>
          <li>Enter a street name and choose your arrival time</li>
          <li>Green dots indicate available parking spots</li>
          <li>Red dots show occupied parking spots</li>
          <li>Always check local parking rules and restrictions</li>
          <li>Consider alternative parking options during peak hours</li>
        </ol>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

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

/* Map Loading Overlay */
.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.map-loading-overlay p {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

.text-field {
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
  padding: 16px;
  background: #6B46C1;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px 0;
}

.search-btn:hover:not(:disabled) {
  background: #5A3D9E;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-loading-spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

.guidelines-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.guidelines-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.guidelines-section ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guidelines-section li {
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-white);
  opacity: 0.9;
}

@media (max-width: 1200px) {
  .control-panel {
    width: 300px;
    right: 10px;
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
  
  .text-field {
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
  
  .text-field {
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
  
  .guidelines-section h3 {
    font-size: 14px;
  }

  .guidelines-section li {
    font-size: 13px;
  }

  .map-overlay-info {
    left: 6px;
    padding: 5px 8px;
    border-radius: 12px;
  }
  
  .info-label {
    font-size: 8px;
  }
}
</style>
