<template>
  <input-field
    aria-label="Name"
    placeholder="Name"
    v-model="playerName"
    @input="(event) => (playerName = event.target.value)"
  ></input-field>
  <!-- nur für Player -->
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
  <!-- nur für Player -->
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
      this.saveLobbyCode(data.roomId, data.playerId);
    },
    "me/join": function (data) {
      console.log(data);
      this.saveLobbyCode(data.roomId, data.playerId);
    },
    "me/error": function (data) {
      console.log(data.errorCode);
    },
  },
  methods: {
    savePlayerName() {
      this.store.savePlayer(this.playerName);
    },
    saveLobbyCode(roomId, playerId) {
      if (roomId !== undefined) this.lobbyCode = roomId;
      this.playerId = playerId;
      console.log(this.lobbyCode);
      this.store.saveRoomId(this.lobbyCode);
      this.store.savePlayerId(this.playerId);
      localStorage.setItem("roomId", this.lobbyCode);
      localStorage.setItem("playerId", this.playerId);
    },
    sendHost: function () {
      this.$socket.emit("server/host", { playerName: this.playerName });
    },
    sendPlayer: function () {
      this.$socket.emit(`server/join`, {
        playerName: this.playerName,
        roomId: parseInt(this.lobbyCode),
      });
    },

    createLobby() {
      this.savePlayerName();
      this.sendHost();

      this.$router.push("lobby");
    },

    joinLobby() {
      console.log(this.lobbyCode);
      this.savePlayerName();
      this.sendPlayer();
      localStorage.setItem("roomId", this.lobbyCode);
      localStorage.setItem("playerId", this.playerId);
      this.$router.push("lobby");
    },
  },
};
</script>
