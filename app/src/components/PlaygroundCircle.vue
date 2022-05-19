<template>
  <GMapCluster>
    <GMapCircle
      :center="startPoint"
      :radius="300"
      :visible="true"
      :options="{
        strokeColor: '#f06449',
        strokeOpacity: 0.8,
        strokeWidth: 50,
        fillOpacity: 0,
      }"
    />
  </GMapCluster>
</template>

<script>
import { gameStore } from "@/stores";

export default {
  name: "PlaygroundCircle",
  data() {
    const store = gameStore();

    return {
      store,
      startPoint: null,
    };
  },
  created() {
    this.startPoint = this.store.startPoint;
  },
};
</script>

<style></style>
