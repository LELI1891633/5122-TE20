<script setup lang="ts"></script>

<template>
  <footer class="footer">
    <div class="inner">
      <div class="bubble">
        <h4>Data sources and Disclaimer</h4>
        <p>We use open-source data and predictive analysis to estimate parking availability, though accuracy may vary by source and update frequency.</p>

        <h4>Privacy and permissions</h4>
        <p>The app estimates parking from public data and no location tracking is needed.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer{
  margin-top: 28px;
  background: linear-gradient(90deg,#6a5acd,#8a63d2);
  border-top-left-radius: 28px; border-top-right-radius: 28px;
}
.inner{ max-width:1200px; margin:0 auto; padding: 22px 18px; }
.bubble{
  background: rgba(255,255,255,.15);
  color:#fff; padding: 18px; border-radius: 18px;
}
h4{ margin: 0 0 6px; font-size: 16px; }
p{ margin: 0 0 10px; line-height: 1.5; }
</style>
