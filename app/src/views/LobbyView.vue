<template>
  <div>
    <div class="rectangle">
      <div class="container">
        <h1>Lobby</h1>
        <div class="rectUser">
          <p>Room Code: {{ store.roomId }}</p>
        </div>
        <h2>Players:</h2>
        <div class="rectPlayers">
          <p v-for="(player, idx) in allPlayers" :key="idx">
            <span>{{ player }}</span>
          </p>
        </div>

        <button-comp
          class="startBtn"
          v-if="this.store.isHost"
          @click="sendAllPlayers()"
          >Start</button-comp
        >
        <span v-if="!this.store.isHost"
          >Warte bis der Host das Spiel startet</span
        >

        <toast-msg
          id="wait"
          msg="Gleich können wir starten ... Probiere es in ein paar Sekunden nocheinmal."
          bgColor="primary"
        />
        <toast-msg
          id="locationError"
          msg="Wir benötigen deinen Standort, dass du spielen kannst!"
          bgColor="danger"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { geoStore, gameStore } from "@/stores";

import ToastMsg from "../components/ToastMsg.vue";
import ButtonComp from "@/components/ButtonComp.vue";

export default {
  name: "LobbyView",
  components: { ButtonComp, ToastMsg },
  data() {
    const store = gameStore();
    const useGeoStore = geoStore();

    return {
      useGeoStore,
      store,
      allPlayers: [],
      playerName: "",
      roomId: "",
    };
  },
  created() {
    this.getAllPlayers();
    this.getCurrPos();
    this.checkIfUserIsLoggedIn();
  },

  sockets: {
    "lobby/players": function (data) {
      this.allPlayers = data.players.map((it) => it.name);
    },
    "lobby/ready": function () {
      this.$router.push("game");
    },
    "lobby/changed": function () {
      this.getAllPlayers();
    },
    "me/error": function (data) {
      console.log("errCode: " + data.errorCode);
    },
  },
  methods: {
    checkIfUserIsLoggedIn() {
      if (!localStorage.getItem("playerId")) {
        console.log("not");
        this.$router.push("/");
      } else {
        console.log("loggedin");
        this.store.savePlayerId(localStorage.getItem("playerId"));
        this.store.savePlayer(localStorage.getItem("playerName"));
        this.store.saveRoomId(localStorage.getItem("roomId"));
      }
    },
    getAllPlayers() {
      console.log(this.allPlayers);

      this.$socket.emit("lobby/players", {
        playerId: this.store.playerId,
        roomId: parseInt(this.store.roomId),
      });
    },

    sendAllPlayers() {
      this.getCurrPos(() => {
        const pos = { ...this.useGeoStore.position };

        this.$socket.emit("lobby/ready", {
          playerId: this.store.playerId,
          roomId: parseInt(this.store.roomId),
          location: {
            lat: pos.lat,
            lng: pos.lng,
          },
        });

        this.$router.push("game");
      });
    },

    // get host position at beginning
    getCurrPos(_callback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            this.useGeoStore.updatePosition(position.coords);
            this.store.setStartPoint(position.coords);

            _callback();
          },
          () => {
            this.locationError();
          }
        );
      } else {
        this.locationError();
      }
    },
    locationError() {
      this.showToast("locationError");
    },
    showToast(id) {
      const toast = document.getElementById(id);

      // eslint-disable-next-line no-undef
      const action = new bootstrap.Toast(toast);
      action.show();
    },
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
  justify-content: space-between;
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
  margin-top: 40px;
}

h2 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  text-align: center;
  color: #5a81bc;
}

p {
  color: #ffffff;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  text-align: center;
  margin-top: 10px;
}

.rectUser {
  width: 70vw;
  height: 65px;
  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.rectPlayers {
  width: 70vw;
  height: 36vh;
  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  overflow: scroll;
}

.startBtn {
  margin-top: 15px;
  width: 127px;
  margin-bottom: 10px;
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
</style>
