<template>
  <GMapMarker
    class="marker"
    :position="position"
    :clickable="true"
    :icon="{
      url: img,
      scaledSize: { width: 35, height: 30 },
    }"
    @click="$emit('openWindow')"
  />
</template>

<script>
const img_path = await import("../assets/img/EnemyBot.png");

export default {
  name: "EnemyPin",
  data() {
    return {
      img: img_path.default,
    };
  },
  props: ["position"],
  emits: ["openWindow"],
};
</script>

<style></style>
