<template>
  <p>Endscreen</p>
</template>

<script>
export default {
  name: "EndView",
  created() {
    document.addEventListener("beforeunload", this.deleteStorage);
  },
  methods: {
    deleteStorage() {
      localStorage.clear();
    },
  },
};

//allPlayers + their stats for basic + items if more
</script>

<style scoped>
</style>
