<template>
  <GMapMarker
    class="marker"
    :position="position"
    :icon="{
      url: img,
      scaledSize: { width: 35, height: 30 },
    }"
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
};
</script>

<style></style>
