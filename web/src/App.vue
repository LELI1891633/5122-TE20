<script setup lang="ts">
</script>

<template>
  <div>
    <nav style="display:flex;gap:16px;padding:12px 16px;border-bottom:1px solid #eee;">
      <RouterLink to="/trends">Trends</RouterLink>
      <RouterLink to="/realtime">Real-Time Parking</RouterLink>
      <RouterLink to="/predictions">Predictions</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
nav a { text-decoration: none; }
nav a.router-link-active { font-weight: 700; }
</style>
