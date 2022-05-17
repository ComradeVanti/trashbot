<template>
  <main>Lobby</main>
  <p>{{ store.updatedName }}</p>
  <p>{{ store.roomId }}</p>
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
