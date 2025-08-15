<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="nav">
    <nav class="nav-inner">
      <RouterLink class="brand" to="/home">Park Wise</RouterLink>
      <ul class="links">
        <li><RouterLink to="/realtime">RealTime Parking</RouterLink></li>
        <li><RouterLink to="/trends">Insights</RouterLink></li>
        <li><RouterLink to="/help">Support</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 16px;
  background: linear-gradient(90deg,#6a5acd,#8a63d2);
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 6px 16px rgba(0,0,0,.15);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
}
.brand {
  color: #fff; font-weight: 700;
  text-decoration: none; letter-spacing: .5px; font-size: clamp(18px,2.5vw,22px);
}
.links { list-style: none; display: flex; gap: 22px; margin: 0; padding: 0; }
.links a { color:#fff; text-decoration:none; font-weight:600; opacity:.95; }
.links a.router-link-active { text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 640px){
  .links{ gap: 12px; flex-wrap: wrap; justify-content: flex-end;}
}
</style>