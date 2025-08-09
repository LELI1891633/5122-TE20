<template>
  <div class="help wrap">
    <header class="page-head">
      <h1>Help & Support</h1>
      <p>Everything you need to use Real-Time Parking with confidence.</p>
    </header>

    <section class="grid">
      <article class="card">
        <h2>Steps to start</h2>
        <ol class="steps">
          <li>Choose an area from the selector.</li>
          <li>Adjust time of day to preview expected availability.</li>
          <li>Filter by demand level and tap Search.</li>
          <li>Use Detect my location to center the map on you.</li>
          <li>Set the timer and get reminder notifications</li>
        </ol>
      </article>

      <article class="card">
        <h2>Controls</h2>
        <ul class="bullets">
          <li>Scroll to zoom, drag to pan the map.</li>
          <li>Click a marker to see distance and availability window on the basis prediction.</li>
          <li>Refresh Spots updates the latest feed.</li>
          <li>Right panel filters, changes the results instantly.</li>
        </ul>
      </article>

      <article class="card">
        <h2>Troubleshooting</h2>
        <details>
          <summary>Map is not loading</summary>
          <p>Reload the page. Check your internet connection.</p>
        </details>
        <details>
          <summary>No spots found</summary>
          <p>Lower demand level or change the time slider. Try different suburbs.</p>
        </details>
      </article>



      <article class="card">
        <h2>Privacy & permissions</h2>
        <p> This app does not track or use your real-time location. All parking availability data is based on public feeds and historical patterns for selected areas. You can browse any area by choosing it from the list—no location access is required.</p>
      </article>

      <article class="card">
        <h2>Data sources and Disclaimer</h2>
        <p>    We use open-source data and apply predictive analysis based on parking trends to estimate availability. 
                Data accuracy can vary depending on the source and time of update.</p>
      </article>
    </section>

    <section class="contact card">
      <h2>Need more help?</h2>
      <p>Email support@parkwise.com.au</p>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  font-family: 'Segoe UI', sans-serif;
}

.page-head {
  text-align: center;
  margin-bottom: 30px;
  padding: 60px 16px 40px;
}
.page-head h1 {
  margin: 0 0 6px;
  font-size: 40px;
  font-weight: 900;
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.page-head p {
  margin: 0 0 16px;
  opacity: .85;
  font-size: 18px;
}

.grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.card h2 {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 800;
  color: #333;
  border-left: 4px solid #4e54c8;
  padding-left: 10px;
}
.card p {
  line-height: 1.6;
  color: #555;
}

.steps, .bullets {
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
  color: #555;
}
.steps li, .bullets li {
  margin: 6px 0;
}

details {
  background: #f9f9ff;
  border: 1px solid #e0e0f0;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 10px 14px;
}
summary {
  cursor: pointer;
  font-weight: 700;
  color: #4e54c8;
  outline: none;
}
summary::-webkit-details-marker {
  color: #4e54c8;
}

.grid .card:nth-child(1),
.grid .card:nth-child(2),
.grid .card:nth-child(3),
.grid .card:nth-child(4),
.grid .card:nth-child(5) {
  grid-column: span 6;
}

.contact {
  margin-top: 30px;
  text-align: center;
  background: #f8f8ff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0f0;
}
.contact h2 {
  margin-bottom: 8px;
}

@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .grid .card {
    grid-column: auto;
  }
}
</style>
