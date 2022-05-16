<template>
  <GMapMap
    :center="position"
    :zoom="15"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  >
    <GMapCluster>
      <GMapMarker :position="position" />
      <GMapCircle
        :center="position"
        :radius="10"
        :visible="true"
        :options="{ fillColor: 'blue', fillOpacity: 0.1 }"
      ></GMapCircle>
    </GMapCluster>
  </GMapMap>

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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.position = this.store.updatePosition(position.coords);
          },
          () => {
            console.log("Something went wrong (1)");
          }
        );
      } else {
        console.log("Something went wrong (2)");
      }
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
