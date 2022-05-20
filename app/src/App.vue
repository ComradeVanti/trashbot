<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="content">
   <RouterView />
  </div>
</template>

<style>
@import "@/assets/base.css";

#app {
  width: 100%;
  height: 100%;
  padding: var(--dim-regular);
}

.content {
  background: var(--col-content);
  box-shadow: var(--sdw-inside);
  border-radius: var(--dim-corners);
  padding: var(--dim-regular);
}

</style>
