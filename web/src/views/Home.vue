<template>
    <div class="home">  
      <section class="hero">
        <div class="wrap hero-inner">
          <h1>Find Parking fast in Melbourne CBD</h1>
          <p>Live parking data and trends to reduce congestion and save you time</p>
          <router-link to="/realtimeparking" class="btn-primary">Search Available Spots</router-link>
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
      <h2>Live map visualisation of Real-Time availability</h2>
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
  
  
  vue
  <style scoped>
  .home { color:#333; font-family: 'Segoe UI', sans-serif; }
  
  .wrap { max-width:1100px; margin:0 auto; padding:0 16px; }
  
  .navbar { background:#0f0f0f; color:#fff; border-bottom:1px solid #2a2a2a; }
  .nav-wrap { display:flex; justify-content:space-between; align-items:center; padding:18px 16px; }
  .logo { font-weight:800; font-size:18px; }
  .nav-links a { margin-left:24px; text-decoration:none; color:#fff; }
  .nav-links a:hover { text-decoration:underline; }
  
  .hero { background:#e6e6e6; }
  .hero-inner { padding:40px 16px 24px; text-align:center; }
  .hero-inner h1 { font-size:40px; font-weight:900; margin:0 0 8px; }
  .hero-inner p { margin:0; opacity:.9; }
  
  .btn-primary {
    margin-top:16px;
    background:#fff; color:#000; border:1px solid #d8d8d8;
    padding:10px 16px; border-radius:4px; cursor:pointer;
    display:inline-block; text-decoration:none;
  }
  
  .top-section { background:#fff; }
  .two-col {
    display:grid;
    grid-template-columns: 0.5fr 1fr;
    gap:24px;
    padding:24px 16px 60px;
  }
  
  .left-panel{
  display:grid;
  grid-template-rows: 1fr 1fr;
  gap:24px;
}

.left-top-row{
  background:#0f0f0f;
  color:#fff;
  border-radius:6px;
  padding:22px 20px;
}

.left-bottom-row{
  background:#f3f3f3;
  border:1px solid #e5e5e5;
  border-radius:6px;
  padding:22px 20px;
}
.left-bottom-row h2{ margin:0 0 12px; font-weight:800; }
.left-bottom-row p{ margin:0 0 12px; opacity:.9; }

  .why-section h2 { margin:0 0 12px; font-weight:1000; }
  
  .right-panel {
    background:#f3f3f3; border:1px solid #e5e5e5; border-radius:6px;
    padding:22px 20px;
  }
  .right-panel h2 { font-size:24px; margin:0 0 12px; font-weight:800; }
  .right-panel p { margin:0; }
  .map-icon { font-size:48px; margin-top:24px; }
  
  .illustration{
    width:100%;
    height:clamp(320px, 50vh, 560px);
    border-radius:4px;
    border:1px solid #e5e5e5;
    position:relative;
    background:#0e0e0e;
  }
  .map-layer{ position:absolute; inset:0; border-radius:4px; overflow:hidden; }
  .map-layer :deep(.leaflet-container){ width:100%; height:100%; background:transparent; }
  .map-layer :deep(img){ max-width:none !important; }
  
  .board-sub{ margin:12px 0; font-size:14px; color:#555; }
  .board-actions{ display:flex; gap:12px; flex-wrap:wrap; margin-top:8px; }
  .btn-outline{
    background:#fff; color:#000; border:1px solid #d8d8d8;
    padding:8px 12px; border-radius:4px; cursor:pointer;
  }
  
  .how-it-works { background:#fff; }
  .how-it-works .wrap { padding:24px 16px 60px; text-align:center; }
  .how-it-works h2 { font-size:28px; margin:0 0 24px; font-weight:800; }
  .steps {
    display:flex; justify-content:center; flex-wrap:wrap; gap:60px;
  }
  .step { width:180px; }
  .step .icon { font-size:36px; margin-bottom:12px; }
  .step h3 { margin:0 0 8px; }
  
  @media (max-width: 992px){
    .two-col { grid-template-columns:1fr; }
  }
  </style>
  