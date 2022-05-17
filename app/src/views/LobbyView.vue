<template>
  <main>Lobby</main>
  <p>{{ store.updatedName }}</p>
</template>

<script>
import { gameStore } from "@/stores";
export default {
  setup() {
    const store = gameStore();

    return { store };
  },
};
</script>
