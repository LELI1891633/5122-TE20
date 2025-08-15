<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">We help find you Car's parking spaces</h1>
        <p class="hero-subtitle">Professional and trustworthy</p>
        
        <!-- Feature Cards Section -->
        <div class="features-container">
          <div class="feature-card">
            <h3>Real-Time Parking</h3>
            <p>Find available parking spots in real-time with live map visualization</p>
            <router-link to="/realtime" class="feature-btn">Search Now</router-link>
          </div>
          
          <div class="feature-card">
            <h3>Parking Trends</h3>
            <p>View parking patterns and demand analysis to plan your trips better</p>
            <router-link to="/trends" class="feature-btn">View Trends</router-link>
          </div>
        </div>
        
        <div class="ai-badge">
          AI-Powered Real-Time Parking with 66% accuracy
        </div>
      </div>
    </section>
    
    <!-- Add Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
// Static landing page - no complex logic needed
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: 
    linear-gradient(rgba(107, 70, 193, 0.8), rgba(147, 51, 234, 0.8)), 
    url('../assets/images/city.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px 80px;
  position: relative;
}

.hero-content {
  max-width: 900px;
  width: 100%;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #fff;
  margin: 0 0 48px;
  opacity: 0.9;
  font-weight: 400;
}

/* Features Section */
.features-container {
  max-width: 1000px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.feature-card {
  background: rgba(107, 70, 193, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  background: rgba(107, 70, 193, 1);
}

.feature-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.feature-card p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0 0 24px;
}

.feature-btn {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.feature-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.ai-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 20px 60px;
    min-height: 100vh;
  }
  
  .hero-content {
    max-width: 100%;
    padding: 0 16px;
  }
  
  .features-container {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .feature-card {
    padding: 25px 20px;
  }
  
  .feature-card h3 {
    font-size: 20px;
  }
  
  .feature-card p {
    font-size: 14px;
  }
  
  .ai-badge {
    margin-top: 20px;
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 80px 16px 40px;
  }
  
  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
  
  .features-container {
    gap: 16px;
    margin-bottom: 32px;
  }
  
  .feature-card {
    padding: 20px 16px;
  }
  
  .feature-card h3 {
    font-size: 18px;
  }
  
  .feature-card p {
    font-size: 13px;
  }
  
  .feature-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .ai-badge {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .feature-card {
    padding: 18px 14px;
  }
  
  .feature-card h3 {
    font-size: 17px;
  }
  
  .feature-card p {
    font-size: 12px;
  }
  
  .feature-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>