<template>
  <div class="content">
    <div class="bg">
      <img
        src="/src/assets/img/BackgroundBlob.png"
        class="blob"
        alt="BackgroundBlob"
      />
    </div>
    <div class="form">
      <h1>MATERIAL BOT</h1>
      <div class="robo-image-container">
        <img
          src="/src/assets/img/MainRobot.png"
          alt="Robot"
        />
      </div>
      <input-field
        aria-label="Name"
        placeholder="Name"
        v-model="playerName"
        class="nameField"
        @input="(event) => (playerName = event.target.value)"
      ></input-field>
      <!-- nur für Player -->

      <button-comp class="hostButton" @click="createLobby()"
      >Host
      </button-comp
      >
      <div class="containerJoinBtn">
        <input-field
          aria-label="Lobby-Code"
          placeholder="Lobby-Code"
          v-model="lobbyCode"
          class="codeField"
          @input="(event) => (lobbyCode = event.target.value)"
        ></input-field>
        <button-comp class="joinButton" @click="joinLobby()"
        >Join
        </button-comp
        >
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

h1 {
  font-family: "Play", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 88.7%;
  /* or 48px */
  text-align: center;
  color: #5a81bc;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
}

.content {
  height: 100%;
  position: relative;
}

.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #ffffff;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
}

.form {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.robo-image-container {
  height: 40vh;
}

.robo-image-container img {
  width:100%;
  height:100%;
  object-fit:cover;
}


.blob {
  width: 105%;
  height: 100%;
  left: -1px;
}

.hostButton {
  background: #ed6449;
  z-index: 5;
  align-self: stretch;
  margin-top: 20px;
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
  margin-top: 20px;
}

body {
  background-color: yellow;
}
</style>
