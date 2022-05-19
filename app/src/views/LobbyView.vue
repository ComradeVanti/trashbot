<template>
  <main>Lobby</main>
  <p>{{ store.playerName }}</p>
  <p>{{ store.roomId }}</p>

  <div>
    <div v-for="(player, index) in allPlayers" v-bind:key="index">
      {{ player }}
    </div>
  </div>

  <!-- nur für Host -->
  <button-comp @click="sendAllPlayers()">Start Game</button-comp>

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
      const pos = { ...this.useGeoStore.position };

      if (pos.lat == 0 && pos.lng == 0) {
        this.showToast("wait");
      } else {
        this.$socket.emit("lobby/ready", {
          playerId: this.store.playerId,
          roomId: parseInt(this.store.roomId),
          location: {
            lat: pos.lat,
            lng: pos.lng,
          },
        });
        this.$router.push("game");
      }
    },

    // get host position at beginning
    getCurrPos() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            this.useGeoStore.updatePosition(position.coords);
            this.store.setStartPoint(position.coords);
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
