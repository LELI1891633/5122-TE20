<script setup lang="ts">
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <RouterLink to="/home" class="logo">Park Wise</RouterLink>
      <div class="nav-links">
        <RouterLink to="/realtime">RealTime Parking</RouterLink>
        <RouterLink to="/trends">Insights</RouterLink>
        <RouterLink to="/help">Support</RouterLink>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(107, 70, 193, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: 900;
  color: var(--text-white);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-white);
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .nav-links {
    gap: 16px;
  }
  
  .nav-links a {
    padding: 6px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .logo {
    font-size: 18px;
    margin-bottom: 4px;
  }
  
  .nav-links {
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-links a {
    padding: 6px 10px;
    font-size: 13px;
    border-radius: 16px;
  }
}

@media (max-width: 360px) {
  .navbar {
    padding: 8px 12px;
  }
  
  .logo {
    font-size: 16px;
  }
  
  .nav-links {
    gap: 8px;
  }
  
  .nav-links a {
    padding: 5px 8px;
    font-size: 12px;
  }
}
</style>
