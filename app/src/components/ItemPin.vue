<template>
  <GMapMarker
    class="marker"
    :position="object.location"
    :clickable="false"
    :icon="{
      url: img,
      scaledSize: { width: 30, height: 30 },
    }"
  />
</template>

<script>
const img_path = await import("../assets/img/Gear.png");

export default {
  name: "ItemPin",
  data() {
    return {
      img: img_path.default,
    };
  },
  props: ["object"],
};
</script>

<style></style>
