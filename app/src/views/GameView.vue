<template>
  <GMapMap
    :center="position"
    :zoom="15"

    map-type-id="terrain"
    
    style="width: 500px; height: 300px"
  />
</template>

<script>
export default {
  name: 'GameView',
  data() {
    return {
      position: {
        lat: 48.2137044744728,
        lng: 15.631431169725559
      }
    }
  }

}
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
