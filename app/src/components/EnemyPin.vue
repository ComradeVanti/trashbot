<template>
  <GMapMarker
    class="marker"
    :position="position"
    :icon="{
      url: img,
      scaledSize: { width: 45, height: 40 },
    }"
  />
</template>

<script>
const img_path = await import("../assets/img/EnemyBot.png");

export default {
  name: "EnemyPin",
  setup() {
    return {
      img: img_path.default,
    };
  },
};
</script>

<style></style>
