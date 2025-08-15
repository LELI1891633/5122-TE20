<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
