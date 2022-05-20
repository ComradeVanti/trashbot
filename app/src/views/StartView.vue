<template>
  <div class="column">
    <img
      src="/src/assets/img/BackgroundBlob.png"
      class="blob"
      alt="BackgroundBlob"
    />
    <div class="form">
      <h1 class="main-title">MATERIAL BOT</h1>
      <div class="robo-image-container">
        <img src="/src/assets/img/MainRobot.png" alt="Robot" />
      </div>
      <input-field
        aria-label="Name"
        placeholder="Name"
        v-model="playerName"
        class="nameField"
        @input="(event) => (playerName = event.target.value)"
      ></input-field>
      <!-- nur für Player -->

      <button-comp class="btn-secondary" @click="createLobby()">Host</button-comp>
      <div class="containerJoinBtn">
        <input-field
          aria-label="Lobby-Code"
          placeholder="Code"
          v-model="lobbyCode"
          class="codeField"
          @input="(event) => (lobbyCode = event.target.value)"
        ></input-field>
        <button-comp class="joinButton btn-primary" @click="joinLobby()">Join</button-comp>
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
      store
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    "me/host": function(data) {
      console.log(data);
      this.saveLobbyCode(data.roomId, data.playerId);
      this.$router.push("lobby");
    },
    "me/join": function(data) {
      console.log(data);
      this.saveLobbyCode(data.roomId, data.playerId);
      this.$router.push("lobby");
    },
    "me/error": function(data) {
      console.log(data.errorCode);
    }
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
    sendHost: function() {
      this.$socket.emit("server/host", { playerName: this.playerName });
    },
    sendPlayer: function() {
      this.$socket.emit(`server/join`, {
        playerName: this.playerName,
        roomId: parseInt(this.lobbyCode)
      });
    },

    createLobby() {
      this.store.updateIsHost();
      this.savePlayerName();
      this.sendHost();
      localStorage.setItem("playerId", this.playerId);
    },

    joinLobby() {
      console.log(this.lobbyCode);
      this.savePlayerName();
      this.sendPlayer();
      localStorage.setItem("roomId", this.lobbyCode);
      localStorage.setItem("playerId", this.playerId);
    }
  },
  created() {
    console.log(import.meta.env.BASE_URL);
    localStorage.clear();
  }
};
</script>

<style scoped>

.blob {
  position: absolute;
  width: 120%;
  height: 103%;
  left: -10%;
}

h1.main-title {
  margin-top:  var(--dim-regular);
  font-size: var(--fnt-sze-title-main);
  line-height: 88.7%;
}

.form {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: var(--dim-regular);
  height: 100%;
}

.robo-image-container {
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  margin-top: auto;
  margin-bottom: var(--dim-regular);
}

.robo-image-container img {
  height: 100%;
  object-fit: contain;
}

.btn-secondary {
  margin-top: var(--dim-regular);
  width: 100%;
}

.joinButton {
  min-width: 40%;
  margin-left: var(--dim-small);
}

.containerJoinBtn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: var(--dim-regular);
  align-items: center;
}

</style>
