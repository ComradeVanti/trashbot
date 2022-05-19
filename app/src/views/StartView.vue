<template>
  <div>
    <div class="rectangle">
      <img
        src="/src/assets/img/BackgroundBlob.png"
        class="blob"
        alt="BackgroundBlob"
      />
      <div class="container">
        <h1>MATERIAL BOT</h1>
        <img
          src="/src/assets/img/MainRobot.png"
          class="robotImage"
          alt="Robot"
        />
        <input-field
          aria-label="Name"
          placeholder="Name"
          v-model="playerName"
          class="nameField"
          @input="(event) => (playerName = event.target.value)"
        ></input-field>
        <!-- nur für Player -->

        <br />
        <button-comp class="hostButton" @click="createLobby()"
          >Host</button-comp
        >
        <br />

        <div class="containerJoinBtn">
          <input-field
            aria-label="Lobby-Code"
            placeholder="Lobby-Code"
            v-model="lobbyCode"
            class="codeField"
            @input="(event) => (lobbyCode = event.target.value)"
          ></input-field>
          <button-comp class="joinButton" @click="joinLobby()"
            >Join</button-comp
          >
        </div>

        <!-- nur für Player -->
      </div>
    </div>
  </div>
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
.container {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  height: 100%;
  align-items: center;
}
h1 {
  width: 306px;
  font-family: "Play", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 88.7%;
  /* or 48px */
  text-align: center;
  color: #5a81bc;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  margin-top: 10px;
}

.rectangle {
  position: absolute;
  width: 90vw;
  height: 90vh;
  margin: 5vh 5vw;
  background: #ffffff;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
}

.robotImage {
  z-index: 10;
  max-height: 50%;
  min-height: 50%;
}

.blob {
  position: absolute;
  width: 105%;
  height: 105%;
  z-index: 5;
  left: -5px;
}

.hostButton {
  background: #ed6449;
  z-index: 5;
  align-self: stretch;
}

.joinButton {
  background: #59c2ea;
  z-index: 5;
  width: 40%;
  margin-left: 10px;
}

.nameField {
  height: 53px;
  z-index: 5;
}

.codeField {
  height: 53px;
  z-index: 5;
  width: 60%;
}

.containerJoinBtn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: stretch;
}

body {
  background-color: yellow;
}
</style>
