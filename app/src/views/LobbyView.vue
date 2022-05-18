<template>
  <main>Lobby</main>
  <p>{{ store.updatedName }}</p>
  <p>{{ store.roomId }}</p>

  <div>
    <div v-for="(player, index) in allPlayers" v-bind:key="index">
      {{ player }}
    </div>
  </div>
</template>

<script>
import { gameStore } from "@/stores";
export default {
  data() {
    const store = gameStore();

    return { store, allPlayers: [], timeoutId: "" };
  },
  sockets: {
    "lobby/players": function (data) {
      this.allPlayers = data.players.map((it) => it.name);
    },
  },
  methods: {
    getAllPlayers() {
      this.$socket.emit("lobby/players", {
        playerId: this.store.playerId,
        roomId: parseInt(this.store.roomId),
      });
    },
  },
  mounted() {
    const seconds = 1;

    this.timeoutId = window.setInterval(() => {
      this.getAllPlayers();
    }, seconds * 1000);
  },
};
</script>
