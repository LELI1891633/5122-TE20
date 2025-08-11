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
      <div class="map-board">
        <div ref="mapEl" class="map"></div>
        <div class="map-overlay">
          <div class="map-title">Live map visualisation of Real-Time availability</div>
        </div>
        <div class="map-footer">
          View available spots in real-time by time of day, area and current demand
        </div>
      </div>
      <div v-if="errorMsg" class="board-error">{{ errorMsg }}</div>
    </section>

    <!-- Right side filter -->
    <aside class="filter">
             <h2>Select Area</h2>
       <div style="position: relative;">
         <input 
           type="text" 
           v-model="areaInput" 
           @input="validateArea"
           placeholder="Enter zone number or street name"
           class="input-field"
           :class="{ 'invalid': areaError }"
         />
         <div v-if="areaError" class="error-message">{{ areaError }}</div>
         <div v-if="filteredZones.length && !areaError" class="autocomplete">
           <div 
             v-for="(zone, index) in filteredZones" 
             :key="`${zone.zoneNumber}-${zone.streetName}-${index}`"
             class="autocomplete-item"
             @click="selectZone(zone)"
           >
             {{ zone.streetName }} (Zone {{ zone.zoneNumber }})
           </div>
         </div>
       </div>

      <h3>Time of Day</h3>
      <div class="time-display">
        <input class="range" type="range" min="0" max="23" v-model.number="hour" />
        <span class="time-label">{{ formatHour(hour) }}</span>
      </div>

      <h3>Demand Level</h3>
      <div class="btn-group">
        <button class="chip" :class="{active: demand==='High'}" @click="setDemand('High')">High</button>
        <button class="chip" :class="{active: demand==='Medium'}" @click="setDemand('Medium')">Medium</button>
        <button class="chip" :class="{active: demand==='Low'}" @click="setDemand('Low')">Low</button>
      </div>

      <button class="btn-primary" @click="onSearch">Search Now</button>

      <h3>Parking Timer</h3>
      <div class="timer">
        <div class="timer-options">
          <button
            v-for="m in timerOptions"
            :key="m"
            class="timer-pill"
            :class="{ active: selectedMinutes===m }"
            @click="selectedMinutes = m"
          >{{ m }} min</button>
        </div>
        <div class="timer-actions">
          <button class="btn-primary" @click="onStartTimer">Start Timer</button>
          <button class="btn-outline" @click="onResetTimer" :disabled="!timerActive">Reset</button>
        </div>
        <div v-if="timerActive" class="timer-display">Remaining: {{ remainingText }}</div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Demand = 'High'|'Medium'|'Low'
const area   = ref<string>('')
const areaInput = ref<string>('') // Input field for area selection
const areaError = ref<string>('') // Error message for invalid area
const filteredZones = ref<Array<{zoneNumber: string, streetName: string}>>([]) // Filtered zones for autocomplete
const hour   = ref<number>(12)
const demand = ref<Demand>('Medium')
const errorMsg = ref('')
const zones = ref<Array<{zoneNumber: string, streetName: string}>>([])

// Load available zones from database
async function loadZones() {
  try {
    const res = await fetch('/api/realtime/zones')
    if (res.ok) {
      const data = await res.json()
      zones.value = data.zones
      console.log('Loaded zones:', zones.value.length)
    }
  } catch (e) {
    console.error('Failed to load zones:', e)
  }
}

// Area validation and autocomplete
function validateArea() {
  areaError.value = ''
  filteredZones.value = []
  
  if (!areaInput.value.trim()) {
    // Don't show error when input is empty
    return
  }
  
  const input = areaInput.value.toLowerCase().trim()
  
  // Filter zones based on input
  filteredZones.value = zones.value.filter(zone => 
    String(zone.zoneNumber).toLowerCase().includes(input) ||
    zone.streetName.toLowerCase().includes(input)
  )
  
  // Check if input matches exactly
  const exactMatch = zones.value.find(zone => 
    String(zone.zoneNumber) === areaInput.value || 
    zone.streetName.toLowerCase() === input
  )
  
  // Only show error if input is not empty and no matches found
  if (input.length > 0 && !exactMatch && filteredZones.value.length === 0) {
    areaError.value = 'Invalid zone number or street name'
  }
  
  // Debug logging
  console.log('validateArea called:', {
    input: areaInput.value,
    filteredCount: filteredZones.value.length,
    zones: zones.value.length
  })
}

function selectZone(zone: {zoneNumber: string, streetName: string}) {
  areaInput.value = zone.zoneNumber
  area.value = zone.zoneNumber
  areaError.value = ''
  filteredZones.value = []
}

// Format hour to display time
function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

async function onSearch(){
  errorMsg.value = ''
  await loadSpots()
}
// 移除Refresh Spots和Detect my location相关的JS函数、变量、事件绑定
// 精简注释，只保留关键逻辑的英文注释
function setDemand(d: Demand){ demand.value = d }

// Map container ref and lifecycle
const mapEl = ref<HTMLDivElement|null>(null)
let map: L.Map | null = null
let ro: ResizeObserver | null = null
let layerGroup: L.LayerGroup | null = null

onMounted(async () => {
  await loadZones() // Load zones first
  // Set initial area input value
  areaInput.value = area.value
  
  // Restore timer state from localStorage
  const savedTimer = localStorage.getItem('parkingTimer')
  if (savedTimer) {
    try {
      const timerData = JSON.parse(savedTimer)
      const now = Date.now()
      
      if (timerData.endAt && timerData.endAt > now) {
        // Timer is still active, restore it
        endAt.value = timerData.endAt
        selectedMinutes.value = timerData.selectedMinutes || 30
        timerActive.value = true
        
        // Start the timer
        tick()
        if (timerHandle) window.clearInterval(timerHandle)
        timerHandle = window.setInterval(tick, 250)
        ensureNotifyPermission()
      } else {
        // Timer has expired, clear it
        localStorage.removeItem('parkingTimer')
      }
    } catch (e) {
      console.error('Failed to restore timer:', e)
      localStorage.removeItem('parkingTimer')
    }
  }
  
  await nextTick()
  if (!mapEl.value) return
  map = L.map(mapEl.value, { zoomControl: true, scrollWheelZoom: true })
    .setView([-37.8136, 144.9631], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    detectRetina: true
  }).addTo(map)
  layerGroup = L.layerGroup().addTo(map)
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

type SpotsResp = { area: string; hour: number; demand: Demand; spots: { id:string; lat:number; lng:number; occupied:boolean }[] }
async function loadSpots(){
  try{
    if (!map) return
    const params = new URLSearchParams({ area: area.value, hour: String(hour.value), demand: demand.value })
    console.log('Loading spots with params:', params.toString())
    
    const res = await fetch(`/api/realtime/spots?${params.toString()}`)
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json() as SpotsResp
    console.log('Received spots data:', data)
    
    renderSpots(data.spots)
  }catch(e:any){
    console.error('Error loading spots:', e)
    errorMsg.value = e?.message ?? 'Failed to load spots'
  }
}

function renderSpots(spots: { id:string; lat:number; lng:number; occupied:boolean }[]){
  if (!map || !layerGroup) return
  console.log('Rendering spots:', spots.length, 'spots')
  
  // Clear existing markers
  layerGroup.clearLayers()
  
  if (spots.length === 0) {
    console.log('No spots to render')
    return
  }
  
  // Add new markers - all spots start as red (occupied), then change to green if available
  for (const s of spots){
    console.log('Adding spot:', s.id, 'at', s.lat, s.lng, 'occupied:', s.occupied)
    
    // Create marker with red color initially (all spots are considered occupied by default)
    const marker = L.circleMarker([s.lat, s.lng], {
      radius: 6,
      color: '#e74c3c', // Start with red (occupied)
      weight: 1,
      fillOpacity: 0.9
    })
    
    // Update color based on actual status
    if (!s.occupied) {
      marker.setStyle({ color: '#2ecc71' }) // Green for available
      marker.bindTooltip('Available')
    } else {
      marker.bindTooltip('Occupied')
    }
    
    marker.addTo(layerGroup)
  }
  
  // Auto-zoom to the area with parking spots
  flyToArea(spots)
  console.log('Finished rendering spots')
}

// Calculate map center and fly to area with parking spots
function flyToArea(spots: { id:string; lat:number; lng:number; occupied:boolean }[]) {
  if (!map || spots.length === 0) return
  
  try {
    const lats = spots.map(s => s.lat)
    const lngs = spots.map(s => s.lng)
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    
    // Create bounds for all spots
    const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]))
    
    // Fly to the area with some padding
    map.fitBounds(bounds, { 
      padding: [20, 20],
      maxZoom: 16,
      animate: true
    })
    
    console.log('Flying to area:', centerLat, centerLng, 'with', spots.length, 'spots')
  } catch (error) {
    console.error('Error flying to area:', error)
  }
}

// Parking Timer (minimal, no extra files)
const timerOptions = [30, 60, 120, 180]
const selectedMinutes = ref<number>(30)
const timerActive = ref(false)
const endAt = ref<number|null>(null)
const remainingText = ref('00:00')
let timerHandle: number | null = null

function onStartTimer(){
  const mins = selectedMinutes.value || 30
  endAt.value = Date.now() + mins * 60_000
  timerActive.value = true
  
  // Save timer state to localStorage
  localStorage.setItem('parkingTimer', JSON.stringify({
    endAt: endAt.value,
    selectedMinutes: selectedMinutes.value
  }))
  
  tick()
  if (timerHandle) window.clearInterval(timerHandle)
  timerHandle = window.setInterval(tick, 250)
  
  // Request notification permission and show notification
  ensureNotifyPermission()
  
  // Show immediate notification with delay to ensure permission is granted
  setTimeout(() => {
    notify('Timer Started', `Parking timer set for ${selectedMinutes.value} minutes`)
  }, 100)
}

function onResetTimer(){
  if (timerHandle) { window.clearInterval(timerHandle); timerHandle = null }
  timerActive.value = false
  endAt.value = null
  remainingText.value = '00:00'
  
  // Clear timer state from localStorage
  localStorage.removeItem('parkingTimer')
}

function tick(){
  if (!endAt.value) return
  const ms = Math.max(0, endAt.value - Date.now())
  remainingText.value = formatDuration(ms)
  if (ms === 0){
    if (timerHandle) { window.clearInterval(timerHandle); timerHandle = null }
    timerActive.value = false
    notify('Parking timer', 'Time is up. Please return to your car.')
  }
}

function formatDuration(ms: number): string{
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(2,'0')
  const ss = String(s).padStart(2,'0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

function ensureNotifyPermission(){
  if ('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission)
    }).catch(()=>{})
  }
}

function notify(title: string, body: string){
  if (!('Notification' in window)) return
  
  // Try to show notification
  if (Notification.permission === 'granted'){
    new Notification(title, { body })
  } else if (Notification.permission === 'default') {
    // Request permission and then show notification
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body })
      } else {
        // Fallback to alert if notification is denied
        alert(`${title}: ${body}`)
      }
    })
  } else {
    // Fallback to alert if notification is denied
    alert(`${title}: ${body}`)
  }
}
</script>

<style scoped>
/* Top banner */
.hero { background: linear-gradient(135deg, #9196fc, #8f94fb); }
.hero-inner { max-width:1100px; margin:0 auto; padding:40px 16px 24px; text-align:center; }
.hero h1 { font-size:42px; font-weight:900; margin:0; color:#fff; } /* Changed to white text on light purple background */

/* Two-column layout */
.rt-container {
  max-width:1100px; margin:0 auto; padding:24px 16px 60px;
  display:grid; grid-template-columns: 1fr 360px; gap:24px;
}

/* Left board - matching Home page style */
.board {
  background:#f9f9ff; color:#4e54c8; border:1px solid #e5e5e5; border-radius:12px;
  padding:18px 18px 24px; display:flex; flex-direction:column; align-items:center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.board-title { margin:6px 0 16px; font-weight:700; opacity:.95; color:#4e54c8; }

/* Map board */
.map-board{
  width:100%; height:clamp(380px, 56vh, 640px);
  border-radius:4px; border:1px solid #333; background:#0e0e0e;
  position:relative; /* Provides positioning context for absolutely positioned map and overlay */
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.map-overlay{
  position:absolute; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.5); border-radius:4px; z-index:1;
  display:flex; align-items:center; justify-content:center;
}
.map-title{
  font-size:24px; font-weight:800; color:#fff; text-align:center;
}
.map-footer{
  position:absolute; bottom:10px; left:0; right:0;
  font-size:14px; color:#fff; text-align:center; opacity:0.8;
}
.map{ position:absolute; inset:0; z-index:2; border-radius:4px; overflow:hidden; }

/* Leaflet adjustments: fill container and avoid image scaling issues */
.map :deep(.leaflet-container){ width:100%; height:100%; background:transparent; }
.map :deep(img){ max-width:none !important; }

.board-sub { margin:14px 0 10px; color:#4e54c8; opacity:0.8; font-size:14px; text-align:center; }
.board-actions { display:flex; gap:18px; position:relative; z-index:1; }
.btn-outline{
  appearance:none; background:#fff; color:#4e54c8; border:1px solid #d8d8d8;
  padding:8px 16px; border-radius:4px; cursor:pointer;
}
.board-error{
  color:#ff6b6b; font-size:14px; margin-top:10px; text-align:center;
}

/* Right filter card - matching Home page style */
.filter{
  background:#f9f9ff; color:#4e54c8; border:1px solid #e5e5e5; border-radius:12px; padding:22px 20px; height:fit-content;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.filter h2{ font-size:24px; margin:0 0 12px; font-weight:800; color:#4e54c8; }
.filter h3{ margin:18px 0 8px; font-size:16px; font-weight:800; color:#4e54c8; }
.input-field{
  width:100%; padding:8px 10px; border-radius:4px; border:1px solid #d8d8d8; background:#fff; color:#4e54c8; position:relative;
}
.input-field.invalid{
  border-color:#ff6b6b; box-shadow:0 0 0 2px rgba(255,107,107,.25) inset;
}
.error-message{
  color:#ff6b6b; font-size:12px; margin-top:4px;
}
.autocomplete{
  position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid #d8d8d8; border-radius:4px; max-height:200px; overflow-y:auto; z-index:1000; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.autocomplete-item{
  padding:8px 10px; cursor:pointer; color:#4e54c8;
}
.autocomplete-item:hover{
  background:#f5f5f5;
}
.select{
  width:100%; padding:8px 10px; border-radius:4px; border:1px solid #d8d8d8; background:#fff; color:#4e54c8;
}
.time-display{
  display:flex; align-items:center; gap:12px; margin-bottom:8px;
}
.time-label{
  font-size:14px; font-weight:600; color:#4e54c8; min-width:40px;
}
.range{ width:100%; accent-color:#7b6bd6; }

.btn-group{ display:flex; gap:12px; margin-bottom:18px; }
.chip{
  background:#fff; color:#4e54c8; border:1px solid #d8d8d8; padding:6px 12px; border-radius:4px; cursor:pointer;
}
.chip.active{ background:#4e54c8; color:#fff; border-color:#4e54c8; }
.btn-primary{
  width:100%; background:#fff; color:#4e54c8; border:1px solid #d8d8d8; padding:10px 0; border-radius:4px; cursor:pointer;
}
.timer{ margin-top:12px; padding-top:8px; border-top:1px solid #e5e5e5; }
.timer-options{ display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
.timer-pill{ width:100%; background:#fff; color:#4e54c8; border:1px solid #d8d8d8; padding:8px 10px; border-radius:4px; cursor:pointer; text-align:left; }
.timer-pill.active{ border-color:#7b6bd6; box-shadow:0 0 0 2px rgba(123,107,214,.25) inset; color:#4e54c8; }
.timer-actions{ display:flex; gap:10px; }
.timer-display{ margin-top:8px; font-size:14px; opacity:.9; color:#4e54c8; }
/* Responsive */
@media (max-width: 992px){
  .rt-container{ grid-template-columns: 1fr; }
}
</style>
