<template>
  <!-- <main>Hello World</main> -->

  <input-field
    aria-label="Name"
    placeholder="Name"
    v-model="playerName"
    @input="(event) => (playerName = event.target.value)"
  ></input-field>
  <input-field
    aria-label="Lobby Code"
    placeholder="Lobby Code"
    v-model="lobbyCode"
    @input="(event) => (lobbyCode = event.target.value)"
  ></input-field>

  <br />
  <button-comp @click="createLobby()">Host</button-comp>
  <br />
  <br />
  <button-comp @click="joinLobby()">Join</button-comp>
</template>

<script>
import InputField from "@/components/InputField.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import { gameStore } from "@/stores";
export default {
  components: { InputField, ButtonComp },
  name: "GameView",
  setup() {
    const store = gameStore();

    return {
      store,
    };
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    "me/host": function (data) {
      console.log(data);
      // this.$socket.emit(`${data.roomId}/get-actors`, { playerId: 123 });
    },
    "me/actors": function (data) {
      console.log(data);
    },
  },
  methods: {
    savePlayerName() {
      console.log(this.playerName);
      this.store.savePlayer(this.playerName);
      //save to state?
    },
    saveLobbyCode() {
      console.log(this.lobbyCode);
      //save to state?
    },
    sendHost: function () {
      this.$socket.emit("server/host", { playerName: this.playerName });
    },
    sendPlayer: function () {
      this.$socket.emit("server/join", {
        playerName: this.playerName,
        roomId: 123,
      });
    },

    createLobby() {
      console.log(this.playerName);
      this.savePlayerName();
      // this.sendHost();
      this.$router.push("lobby");
    },

    joinLobby() {
      console.log(this.lobbyCode);
      console.log(this.playerName);
      this.savePlayerName();
      this.saveLobbyCode();
      // this.sendPlayer();
      this.$router.push("lobby");
      //save to state?
    },
  },
};
</script>
