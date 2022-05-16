<template>
  <GMapMap
    :center="position"
    :zoom="15"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  />

  <button @click="getCurrPos">update</button>
</template>

<script>
import { geoStore } from "../stores/index.ts";

export default {
  name: "GameView",
  data() {
    const store = geoStore();

    return {
      store,
      position: store.position,
    };
  },
  methods: {
    getCurrPos() {
      this.position = this.store.updatePosition();
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
