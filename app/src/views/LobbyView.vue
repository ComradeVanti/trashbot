<template>
  <main>Lobby</main>
  <p>{{ store.updatedName }}</p>
  <p>{{ store.roomId }}</p>

  <div>
    <div v-for="(player, index) in allPlayers" v-bind:key="index">
      {{ player }}
    </div>
  </div>

  <!-- nur für Host -->
  <button-comp @click="sendAllPlayers()">Start Game</button-comp>
</template>

<script>
import { gameStore } from "@/stores";
import ButtonComp from "@/components/ButtonComp.vue";
export default {
  components: { ButtonComp },
  data() {
    const store = gameStore();

    return { store, allPlayers: [], timeoutId: "" };
  },
  sockets: {
    "lobby/players": function (data) {
      this.allPlayers = data.players.map((it) => it.name);
    },
    "lobby/ready": function (data) {
      console.log(data);
    },
  },
  methods: {
    getAllPlayers() {
      this.$socket.emit("lobby/players", {
        playerId: this.store.playerId,
        roomId: parseInt(this.store.roomId),
      });
    },
    sendAllPlayers() {
      this.$socket.emit("lobby/ready", {
        playerId: this.store.playerId,
        roomId: parseInt(this.store.roomId),
      });
      this.$router.push("game");
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
