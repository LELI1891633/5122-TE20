<script setup lang="ts">
</script>

<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/home" class="logo">Park Wise</RouterLink>
      <div class="nav-links">
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/trends">Trends</RouterLink>
        <RouterLink to="/realtime">Real-Time Parking</RouterLink>
        <RouterLink to="/predictions">Predictions</RouterLink>
        <RouterLink to="/help">Help</RouterLink>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 40px;
  border-bottom: 1px solid #4e54c8;
  background-color: #4e54c8;
  z-index: 1000;
}

.logo {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  text-decoration: none;
  flex: 1; /* takes space so nav links shift right */
}

.nav-links {
  display: flex;
  justify-content: space-evenly;
  flex: 2; /* fills middle space */
  gap: 32px;
}

.nav-links a {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
}

.nav-links a.router-link-active {
  font-weight: 700;
}
</style>
