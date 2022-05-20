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
import { gameStore } from "../stores/index.ts";

export default {
  name: "PlaygroundCircle",
  props: ["startPoint"],

  setup() {
    const store = gameStore();

    return {
      store,
    };
  },
};
</script>

<style></style>
