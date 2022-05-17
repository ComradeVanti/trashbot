<template>
  <GMapCluster>
    <GMapMarker :position="position" />
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

export default {
  name: "UserPin",
  computed: {
    ...mapState(geoStore, {
      position: "position",
    }),
  },
};
</script>

<style></style>
