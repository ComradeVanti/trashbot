<template>
  <div>
    <h1>Lobby</h1>
    <div class="rectangle"></div>
    <div class="recPLayers">
      <p>{{ store.playerName }}</p>
    </div>
    <div class="recUser">
      <p>Room Code: {{ store.roomId }}</p>
    </div>
    <h2>Players:</h2>

    <div>
      <div v-for="(player, index) in allPlayers" v-bind:key="index">
        {{ player }}
      </div>
    </div>

    <!-- nur für Host -->
    <button-comp v-if="this.store.isHost" @click="sendAllPlayers()"
      >Start Game</button-comp
    >
    <span v-if="!this.store.isHost">Warte bis der Host das Spiel startet</span>

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
h1 {
  position: absolute;
  width: 266px;
  height: 72px;
  left: 62px;
  top: 83px;
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
}

h2 {
  position: absolute;
  width: 95px;
  height: 30px;
  left: 147px;
  top: 336px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  line-height: 30px;
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

.rectangle {
  position: absolute;
  width: 331px;
  height: 783px;
  left: 29px;
  top: 30px;
  background: #ffffff;
  box-shadow: inset 3px 6px 8px rgba(0, 0, 0, 0.25);
  border-radius: 41px;
}

.startBtn {
  position: absolute;
  width: 127px;
  height: 53px;
  left: 131px;
  top: 726px;
}

.recPLayers {
  position: absolute;
  width: 266px;
  height: 328px;
  left: 62px;
  top: 374px;

  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
}

.recUser {
  position: absolute;
  width: 266px;
  height: 105px;
  left: 62px;
  top: 209px;

  background: #575a68;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
}
</style>
