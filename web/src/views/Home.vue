<template>
    <div class="home">  
      <section class="hero">
        <div class="wrap hero-inner">
          <h1>Find Parking fast in Melbourne CBD</h1>
          <p>Live parking data and trends to reduce congestion and save you time</p>
          <router-link to="/realtime-parking" class="btn-primary">Search Available Spots</router-link>
        </div>
      </section>
  
      <section class="top-section">
        <div class="wrap two-col">
          <div class="left-panel">
            <div class="why-section">
              <h2>Why use Park Wise app?</h2>
              <ul>
                <li>Find spots faster ✔</li>
                <li>Save money and time ✔</li>
                <li>Real-time tracking ✔</li>
              </ul>
            </div>
          </div>
          <div class="right-panel">
            <h2>Real-Time Parking Insights</h2>
            <div class="illustration">
                <div ref="mapEl" class="map-layer"></div>
            </div>
            <router-link to="/realtime-parking" class="btn-primary quick-link">View Live Map</router-link>
          </div>
        </div>
      </section>
  
      <section class="how-it-works">
        <div class="wrap">
          <h2>How it works</h2>
          <div class="steps">
            <div class="step">
              <div class="icon">🔍</div>
              <h3>Search area</h3>
              <p>Enter your destination or area</p>
            </div>
            <div class="step">
              <div class="icon">📍</div>
              <h3>View availability</h3>
              <p>Real-time data appears on the map</p>
            </div>
            <div class="step">
              <div class="icon">🚗</div>
              <h3>Park Smarter</h3>
              <p>Navigate directly to a free spot</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  
  <script>
  export default {
    name: "Home"
  }
  </script>
  
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
  }
  
  .top-section { background:#fff; }
  .two-col {
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:24px;
    padding:24px 16px 60px;
  }
  
  .left-panel { display:flex; }
  .why-section {
    background:#0f0f0f; color:#fff; border-radius:6px;
    padding:22px 20px; width:100%;
  }
  .why-section h2 { margin:0 0 12px; font-weight:800; }
  
  .right-panel {
    background:#f3f3f3; border:1px solid #e5e5e5; border-radius:6px;
    padding:22px 20px;
  }
  .right-panel h2 { font-size:24px; margin:0 0 12px; font-weight:800; }
  .right-panel p { margin:0; }
  .map-icon { font-size:48px; margin-top:24px; }
  
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
  