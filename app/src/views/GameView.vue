<template>
  <GMapMap
    :center="position"
    :zoom="15"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  />
</template>

<script>
import { geoStore } from "../stores/index.ts";

export default {
  name: "GameView",
  data() {
    const store = geoStore();

    return {
      position: store.position,
    };
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
