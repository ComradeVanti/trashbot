<template>
  <img src="/src/assets/img/BackgroundBlob.png" class="blob" alt="BackgroundBlob">
  <h1>MATERIAL BOT</h1>
  <div class="rectangle"></div>
  <img src="/src/assets/img/MainRobot.png" class="robotImage" alt="Robot">
  <input-field
    aria-label="Name"
    placeholder="Name"
    v-model="playerName"
    class="nameField"
    @input="(event) => (playerName = event.target.value)"
  ></input-field>
  <!-- nur für Player -->
  <input-field
    aria-label="Lobby Code"
    placeholder="Lobby Code"
    v-model="lobbyCode"
    class="codeField"
    @input="(event) => (lobbyCode = event.target.value)"
  ></input-field>

  <br />
  <button-comp class="hostButton" @click="createLobby()">Host</button-comp>
  <br />
  <br />
  <!-- nur für Player -->
  <button-comp class="joinButton" @click="joinLobby()">Join</button-comp>
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
      localStorage.setItem("playerName", this.playerName);
    },
    saveLobbyCode(roomId, playerId) {
      if (roomId !== undefined) this.lobbyCode = parseInt(roomId);
      this.playerId = playerId;

      this.store.saveRoomId(parseInt(this.lobbyCode));
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
      this.store.updateIsHost();
      this.savePlayerName();
      this.sendHost();
      localStorage.setItem("playerId", this.playerId);
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
  created() {
    console.log(import.meta.env.BASE_URL);
    localStorage.clear();
  },
};
</script>

<style scoped>
h1 {
  position: absolute;
  width: 306px;
  height: 52px;
  left: 42px;
  top: 66px;
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 88.7%;
  /* or 48px */
  text-align: center;
  color: #5A81BC;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.rectangle {
  position: absolute;
  width: 331px;
  height: 783px;
  left: 29px;
  top: 30px;
  background: #FFFFFF;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
}

.robotImage{
  position: absolute;
  width: 260.04px;
  height: 403px;
  left: 65px;
  top: 178px;
  z-index: 10;
}

.blob{
  position: absolute;
  width: 390px;
  height: 844px;
  left: -1px;
  top: -1px;
  z-index: 5;
}

.hostButton {
  border: none;
  position: absolute;
  width: 269px;
  height: 53px;
  left: 57px;
  top: 671px;
  background: #ED6449;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  font-weight: 700;
  z-index: 5;
}

.joinButton {
  position: absolute;
  width: 127px;
  height: 53px;
  left: 199px;
  top: 739px;
  background: #59C2EA;
  border: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  font-weight: 700;
  z-index: 5;
}

.nameField {
  width: 266px;
  height: 53px;
  left: 60px;
  top: 603px;
  z-index: 5;
}

.codeField {
position: absolute;
width: 128px;
height: 53px;
left: 60px;
top: 739px;
z-index: 5;
}

body {
  background-color: yellow;
}
</style>
