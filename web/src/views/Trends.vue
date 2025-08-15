<template>
  <div class="hero">
    <div class="hero-inner">
      <h1>Trends</h1>
      <p class="sub">Get insights into parking patterns over time in different areas</p>
    </div>
  </div>
  <div class="tr-container">
    <!-- Vehicle Ownership Chart -->
    <section class="chart-board">
      <div class="inner-white">
        <h3>Vehicle Ownership Trends (2016-2021)</h3>
        <div class="chart-container">
          <div v-if="vehicleLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading vehicle data...</p>
          </div>
          <canvas v-show="!vehicleLoading" ref="vehicleCanvas" width="400" height="200"></canvas>
        </div>
        <div class="chart-info">
          <p><strong>Y-Axis:</strong> Vehicle ownership index (relative to base year)</p>
          <p><strong>X-Axis:</strong> Financial years (2016-2021)</p>
        </div>
      </div>
    </section>

    <!-- Population Growth Chart -->
    <section class="chart-board">
      <div class="inner-white">
        <h3>Population Growth Trends (2016-2022)</h3>
        <div class="chart-container">
          <div v-if="populationLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading population data...</p>
          </div>
          <canvas v-show="!populationLoading" ref="populationCanvas" width="400" height="200"></canvas>
        </div>
        <div class="chart-info">
          <p><strong>Y-Axis:</strong> Population count (thousands)</p>
          <p><strong>X-Axis:</strong> Calendar years (2016-2022)</p>
        </div>
      </div>
    </section>
  </div>
  
  <!-- Add Footer -->
  <AppFooter />
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import AppFooter from '@/components/AppFooter.vue'

const vehicleCanvas = ref<HTMLCanvasElement | null>(null)
const populationCanvas = ref<HTMLCanvasElement | null>(null)

const vehicleLoading = ref(true)
const populationLoading = ref(true)

onMounted(async () => { 
  console.log('Trends component mounted')
  
  await nextTick()
  
  console.log('After nextTick - Vehicle canvas:', vehicleCanvas.value)
  console.log('After nextTick - Population canvas:', populationCanvas.value)
  
  setTimeout(async () => {
    await nextTick()
    
    if (vehicleCanvas.value) {
      console.log('Rendering vehicle chart...')
      renderVehicleChart()
    } else {
      console.error('Vehicle canvas still not found')
      vehicleLoading.value = false
    }
    
    if (populationCanvas.value) {
      console.log('Rendering population chart...')
      renderPopulationChart()
    } else {
      console.error('Population canvas still not found')
      populationLoading.value = false
    }
  }, 500)
})

function renderVehicleChart() {
  try {
    const ctx = vehicleCanvas.value!.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get 2D context')
    }
    
    new Chart(ctx, {
      type: 'bar',
      data: { 
        labels: ['2016-17', '2017-18', '2018-19', '2019-20', '2020-21', '2021-22'], 
        datasets: [{ 
          data: [80, 83, 85, 88, 92, 95],
          backgroundColor: '#4ea8de',
          borderColor: '#2a7fbe',
          borderWidth: 2,
          label: 'Vehicle Ownership Index'
        }] 
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: true },
          title: {
            display: true,
            text: 'Vehicle Ownership Trends (2016-2021)'
          }
        },
        scales: { 
          x: { 
            display: true,
            title: {
              display: true,
              text: 'Financial Years'
            }
          }, 
          y: { 
            display: true,
            title: {
              display: true,
              text: 'Vehicle Ownership Index'
            },
            beginAtZero: true
          } 
        }
      }
    })
    
    vehicleLoading.value = false
    console.log('Vehicle chart rendered successfully')
  } catch (e) {
    console.error('Error rendering vehicle chart:', e)
    vehicleLoading.value = false
  }
}

function renderPopulationChart() {
  try {
    const ctx = populationCanvas.value!.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get 2D context')
    }
    
    new Chart(ctx, {
      type: 'line',
      data: { 
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'], 
        datasets: [{ 
          data: [110, 112, 114, 117, 120, 123, 126],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4caf50',
          borderWidth: 3,
          fill: true,
          label: 'Population Count (thousands)',
          tension: 0.4
        }] 
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: true },
          title: {
            display: true,
            text: 'Population Growth Trends (2016-2022)'
          }
        },
        scales: { 
          x: { 
            display: true,
            title: {
              display: true,
              text: 'Calendar Years'
            }
          }, 
          y: { 
            display: true,
            title: {
              display: true,
              text: 'Population Count (thousands)'
            },
            beginAtZero: true
          } 
        }
      }
    })
    
    populationLoading.value = false
    console.log('Population chart rendered successfully')
  } catch (e) {
    console.error('Error rendering population chart:', e)
    populationLoading.value = false
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #9196fc, #8f94fb);
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 16px 24px;
  text-align: center;
}

.hero h1 {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 8px;
  color: #fff;
}

.sub {
  margin: 0;
  color: #fff;
  font-size: 18px;
  opacity: 0.95;
}

.tr-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  padding-bottom: 80px;
}

.chart-board {
  background: #f9f9ff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
  max-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  color: #4e54c8;
  margin-bottom: 20px;
  overflow: hidden;
}

.inner-white {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inner-white h3 {
  margin: 0 0 16px;
  color: #4e54c8;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.inner-white canvas {
  max-width: 100% !important;
  max-height: 200px !important;
  width: auto !important;
  height: auto !important;
}

.chart-container :deep(canvas) {
  max-width: 100% !important;
  max-height: 200px !important;
}

.chart-container :deep(.chartjs-render-monitor) {
  max-width: 100% !important;
  max-height: 200px !important;
}

.chart-info {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.chart-info p {
  margin: 4px 0;
}

.chart-info strong {
  color: #4e54c8;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4e54c8;
}

.loading-spinner {
  border: 4px solid rgba(78, 84, 200, 0.3);
  border-top: 4px solid #4e54c8;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .inner-white {
    width: 100%;
    padding: 16px;
  }
  
  .chart-board {
    padding: 20px;
    min-height: 300px;
  }
}

@media (max-width: 640px) {
  .hero h1 {
    font-size: 32px;
  }
  
  .hero .sub {
    font-size: 16px;
  }
  
  .chart-board {
    padding: 16px;
    min-height: 280px;
  }
  
  .inner-white {
    padding: 12px;
  }
  
  .inner-white h3 {
    font-size: 16px;
  }
}
</style>