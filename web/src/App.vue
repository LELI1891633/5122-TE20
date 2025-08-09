<script setup lang="ts">
</script>

<template>
  <div>
    <nav class="navbar">
      <div class="nav-links">
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/trends">Trends</RouterLink>
        <RouterLink to="/realtime">Real-Time Parking</RouterLink>
        <RouterLink to="/predictions">Predictions</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end; /* push links to right */
  padding: 12px 16px;
  border-bottom: 1px solid #222;
  background-color: #000; /* black background */
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  text-decoration: none;
  color: #fff; /* white text */
}

.nav-links a.router-link-active {
  font-weight: 700;
}
</style>
