<template>
  <GMapCluster>
    <GMapMarker
      class="marker"
      :position="position"
      :icon="{
        url: img,
        scaledSize: { width: 45, height: 40 },
      }"
    />

    <GMapCircle
      :center="position"
      :radius="6"
      :visible="true"
      :options="{
        fillColor: '#54c0ff',
        fillOpacity: 0.05,
        strokeColor: '#54c0ff',
        strokeOpacity: 0.5,
      }"
    />

    <GMapCircle
      :center="position"
      :radius="15"
      :visible="true"
      :options="{
        fillColor: '#54c0ff',
        fillOpacity: 0.0,
        strokeColor: '#54c0ff',
        strokeOpacity: 0.3,
      }"
    />
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

<style></style>
