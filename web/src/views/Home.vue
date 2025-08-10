<template>
    <div class="home">  
      <section class="hero">
        <div class="wrap hero-inner">
          <h1>Find Parking fast in Melbourne CBD</h1>
          <p>Live parking data and trends to reduce congestion and save you time</p>
          <router-link to="/realtime" class="btn-primary">Search Available Spots</router-link>
        </div>
      </section>
  
      <section class="top-section">
  <div class="wrap two-col">
    <div class="left-panel">
      <div class="left-top-row">
        <h2>Why use Melbourne parking app?</h2>
        <ul>
          <li>Find spots faster ✔</li>
          <li>Save money and time ✔</li>
          <li>Real-time tracking ✔</li>
        </ul>
      </div>
      <div class="left-bottom-row">
        <h2>Parking Trends</h2>
        <p>See peak hours and demand patterns to plan ahead.</p>
        <router-link to="/trends" class="btn-primary">View Trends</router-link>
      </div>
    </div>

    <div class="right-panel">
      <h2>Real-Time availability</h2>
      <div class="illustration">
        <div ref="mapEl" class="map-layer"></div>
      </div>

      <div class="board-actions">
        <router-link to="/realtime" class="btn-primary">View Find now</router-link>
      </div>
    </div>
  </div>
</section>

    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  const mapEl = ref(null)
  let map = null
  let ro = null
  
  function onRefresh(){ if (map) map.invalidateSize() }
  function onLocate(){
    if (!map || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      map.setView([latitude, longitude], 15)
      L.marker([latitude, longitude]).addTo(map)
    })
  }
  
  function handleResize(){ setTimeout(() => map && map.invalidateSize(), 80) }
  
  onMounted(async () => {
    await nextTick()
    if (!mapEl.value) return
    map = L.map(mapEl.value, { zoomControl: true, scrollWheelZoom: true })
      .setView([-37.8136, 144.9631], 13)
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
  
    requestAnimationFrame(() => map.invalidateSize())
  
    ro = new ResizeObserver(() => map && map.invalidateSize())
    ro.observe(mapEl.value)
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    ro && ro.disconnect()
    ro = null
    map && map.remove()
    map = null
  })
  </script>
  
  
  <style scoped>
.home {
  color: #333;
  font-family: 'Segoe UI', sans-serif;
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, #9196fc, #8f94fb);
  color: white;
}
.hero-inner {
  padding: 60px 16px 40px;
  text-align: center;
}
.hero-inner h1 {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 12px;
}
.hero-inner p {
  margin: 0 0 20px;
  opacity: 0.95;
  font-size: 18px;
}
.btn-primary {
  margin-top: 8px;
  background: #fff;
  color: #4e54c8;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #f0f0ff;
  transform: translateY(-2px);
}


.top-section {
  background: #fff;
}
.two-col {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 24px;
  padding: 40px 16px 60px;
}

.left-panel {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
}
.left-top-row,
.left-top-row {
  background: #4e54c8;
  color: #fff;
  border-radius: 12px;
  padding: 22px 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* Center items vertically and horizontally */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.left-top-row h2 {
  margin: 0 0 16px;
  font-weight: 800;
  font-size: 24px; /* slightly bigger heading */
}

.left-top-row ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 18px; /* increase point size */
  line-height: 1.8;
}

.left-bottom-row {
  background: #f9f9ff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 22px 20px;
  color: #4e54c8;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  text-align: center; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.left-bottom-row:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.left-bottom-row h2 {
  margin: 0 0 14px;
  font-weight: 800;
  font-size: 22px; /* slightly larger heading */
  color: #4e54c8;
}
.left-bottom-row p {
  margin: 0 0 16px;
  opacity: 0.9;
  font-size: 16px; /* slightly larger text */
}


.right-panel {
  background: #f9f9ff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  color: #4e54c8;
}
.right-panel h2 {
  font-size: 24px;
  margin: 0 0 12px;
  font-weight: 800;
  color: #4e54c8;
}
.illustration {
  width: 100%;
  height: clamp(320px, 50vh, 560px);
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  position: relative;
  background: #0e0e0e;
  margin-bottom: 16px;
}

.map-layer {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  overflow: hidden;
}
.map-layer :deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  background: transparent;
}
.map-layer :deep(img) {
  max-width: none !important;
}

/* Buttons inside panels */
.board-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

/* Responsive tweaks */
@media (max-width: 992px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
