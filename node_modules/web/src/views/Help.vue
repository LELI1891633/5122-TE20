<template>
    <div class="help wrap">
    <header class="page-head">
      <h1>Help & Support</h1>
      <p>Everything you need to use Real-Time Parking with confidence.</p>
    </header>

    <section class="grid">
      <article class="card">
        <h2>Guidelines</h2>
        <ol class="steps">
          <li>Choose an area from the selector.</li>
          <li>Adjust time of day to preview expected availability.</li>
          <li>Tap Search to find available parking spots.</li>
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
          <p>Change the time slider or try different suburbs.</p>
        </details>
      </article>

      <article class="card">
        <h2>Data sources and Disclaimer</h2>
        <p>We use open-source data and apply predictive analysis based on parking trends to estimate availability. Data accuracy can vary depending on the source and time of update.</p>
      </article>
    </section>

    <section class="contact card">
      <h2>Need more help?</h2>
      <p>Email support@parkwise.com.au</p>
    </section>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped>
.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  font-family: 'Segoe UI', sans-serif;
}

.page-head {
  text-align: center;
  margin-bottom: 24px;
  padding: 40px 16px 24px;
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
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.card h2 {
  margin: 0 0 12px;
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
  margin: 5px 0;
}

details {
  background: #f9f9ff;
  border: 1px solid #e0e0f0;
  border-radius: 6px;
  margin-bottom: 6px;
  padding: 8px 12px;
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
.grid .card:nth-child(4) {
  grid-column: span 6;
}

.contact {
  margin-top: 24px;
  text-align: center;
  background: #f8f8ff;
  border-radius: 8px;
  padding: 18px;
  border: 1px solid #e0e0f0;
}
.contact h2 {
  margin-bottom: 6px;
}

@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .grid .card {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .help-container {
    padding: 16px 12px;
  }
  
  .page-head {
    text-align: center;
    padding: 32px 16px 24px;
  }
  
  .page-head h1 {
    font-size: 32px;
    margin-bottom: 12px;
  }
  
  .page-head p {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .grid {
    gap: 12px;
    margin-top: 12px;
  }
  
  .card {
    padding: 16px 14px;
  }
  
  .card h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .card p {
    font-size: 14px;
  }
  
  .steps, .bullets {
    font-size: 14px;
    padding-left: 16px;
  }
  
  .contact {
    margin-top: 20px;
    padding: 14px;
  }
  
  .contact h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .help-container {
    padding: 12px 8px;
  }
  
  .page-head {
    padding: 24px 12px 20px;
  }
  
  .page-head h1 {
    font-size: 28px;
  }
  
  .page-head p {
    font-size: 15px;
  }
  
  .grid {
    gap: 10px;
  }
  
  .card {
    padding: 14px 12px;
  }
  
  .card h2 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .card p {
    font-size: 13px;
  }
  
  .steps, .bullets {
    font-size: 13px;
    padding-left: 14px;
  }
  
  .contact {
    padding: 12px;
  }
  
  .contact h2 {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  .help-container {
    padding: 8px 6px;
  }
  
  .page-head {
    padding: 20px 8px 16px;
  }
  
  .page-head h1 {
    font-size: 24px;
  }
  
  .page-head p {
    font-size: 14px;
  }
  
  .card {
    padding: 12px 10px;
  }
  
  .card h2 {
    font-size: 16px;
  }
  
  .card p {
    font-size: 12px;
  }
  
  .steps, .bullets {
    font-size: 12px;
    padding-left: 12px;
  }
}
</style>
