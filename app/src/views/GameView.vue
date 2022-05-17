<template>
  <GMapMap
    :center="position"
    :zoom="15"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  />
  <button @click="getCurrPos()">update</button>
</template>

<script>
import { mapState } from "pinia";
import { geoStore } from "../stores/index.ts";

export default {
  name: "GameView",
  setup() {
    const store = geoStore();

    return {
      store,
    };
  },
  computed: {
    ...mapState(geoStore, {
      position: "newPosition",
    }),
  },
  created() {
    this.getCurrPos();
  },
  methods: {
    getCurrPos() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.store.updatePosition(position.coords);
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
