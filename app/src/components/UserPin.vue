<template>
  <GMapCluster>
    <GMapMarker
      id="marker"
      :position="position"
      :icon="{
        url: img,
        scaledSize: { width: 45, height: 40 },
      }"
    />
    <GMapCircle
      :center="position"
      :radius="10"
      :visible="true"
      :options="{
        fillColor: 'blue',
        fillOpacity: 0.1,
        strokeColor: 'blue',
        strokeOpacity: 0.5,
      }"
    ></GMapCircle>
    <!-- radius describes m -->
  </GMapCluster>
</template>

<script>
import { mapState } from "pinia";
import { geoStore } from "../stores/index.ts";

const img_path = await import("../assets/img/UserBot.png");

export default {
  name: "UserPin",
  setup() {
    return {
      img: img_path.default,
    };
  },
  computed: {
    ...mapState(geoStore, {
      position: "position",
    }),
  },
};
</script>

<style>
#marker {
  offset: 15px 15px;
}
</style>
