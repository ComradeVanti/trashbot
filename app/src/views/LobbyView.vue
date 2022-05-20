<template>
  <div class="fill-parent">
    <toast-msg
      id="locationError"
      msg="Wir konnten keinen Standort finden! Überprüfe deine Standorteinstellungen."
      bgColor="danger"
    />
    <div class="column">
      <h1>Lobby</h1>
      <div class="rectUser box">
        <p>Room Code: {{ store.roomId }}</p>
      </div>
      <h2>Players:</h2>
      <div class="rectPlayers box">
        <p v-for="(player, idx) in allPlayers" :key="idx">
          <span>{{ player }}</span>
        </p>
      </div>

      <button-comp
        class="startBtn btn-primary"
        v-if="isHost == 'true'"
        @click="sendAllPlayers()"
        >Start
      </button-comp>
      <span v-if="isHost == 'false'">Warte bis der Host das Spiel startet</span>
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
      isHost: false,
      allPlayers: [],
      playerName: "",
      position: {
        lat: 0,
        lng: 0,
      },
      roomId: "",
      positionFound: false,
    };
  },
  created() {
    this.getAllPlayers();
    this.getCurrPos();
    this.checkIfUserIsLoggedIn();
    this.isHost = localStorage.getItem("isHost");
    console.log(localStorage.getItem("isHost"));
  },

  sockets: {
    "lobby/players": function (data) {
      this.allPlayers = data.players.map((it) => it.name);
    },
    "game/start": function (data) {
      this.store.updateTime(data.minutes);
      const position = {
        latitude: data.gameCenter.lat,
        longitude: data.gameCenter.lng,
      };
      this.store.setStartPoint(position);
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
      console.log("Hi");
      this.getCurrPos(() => {
        if (this.positionFound) {
          console.log(this.position);

          this.$socket.emit("lobby/ready", {
            playerId: this.store.playerId,
            roomId: parseInt(this.store.roomId),
            location: {
              lat: this.position.latitude,
              lng: this.position.longitude,
            },
          });

          this.$router.push("game");
        } else {
          this.locationError();
        }
      });
    },

    // get host position at beginning
    getCurrPos(_callback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.useGeoStore.updatePosition(position.coords);
            this.position = position.coords;
            this.store.setStartPoint(position.coords);
            this.positionFound = true;
            _callback();
          },
          () => {
            this.locationError();
            this.positionFound = false;
          }
        );
      } else {
        this.locationError();
        this.positionFound = false;
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
h2 {
  font-size: 26px;
  margin-top: var(--dim-regular);
}

p {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  text-align: center;
  margin-top: var(--dim-small);
}

.rectUser {
  margin-top: var(--dim-large);
  padding: var(--dim-small);
}

.rectPlayers {
  flex-grow: 1;
  overflow: scroll;
  padding: var(--dim-small);
}

.startBtn {
  margin: var(--dim-regular) auto 0;
}
</style>
