<template>
  <div class="content">
    <div id="map-container">
      <GMapMap
        id="map"
        :zoom="18"
        :center="position"
        :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          minZoom: '18',
        }"
      >
        <user-pin />

        <GMapCluster>
          <enemy-pin
            v-for="player in players"
            :key="player['playerId']"
            :position="player['location']"
          />
        </GMapCluster>
      </GMapMap>
    </div>

    <div id="accuracy">Ungenauigkeit: {{ accuracy }}m</div>

    <button
      id="update-btn"
      class="btn btn-primary"
      type="button"
      @click="stopRefresh()"
    >
      Stoppe Refresh
    </button>

    <!--
    <button
      id="update-btn"
      class="btn btn-primary"
      type="button"
      @click="getCurrPos()"
    >
      Aktualisiere Standort
    </button>
    -->
  </div>

  <toast-msg
    id="locationError"
    msg="Standort nicht gefunden. Überprüfe deine Standorteinstellungen."
    bgColor="danger"
  />
  <toast-msg
    id="mapAccuracy"
    msg="Deine aktuelle Position kann bis zu 50m abweichen!"
    bgColor="primary"
  />
</template>

<script>
import { mapState } from "pinia";
import { geoStore, gameStore } from "../stores/index.ts";

import UserPin from "../components/UserPin.vue";
import EnemyPin from "../components/EnemyPin.vue";
import ToastMsg from "../components/ToastMsg.vue";

export default {
  name: "GameView",
  components: { UserPin, EnemyPin, ToastMsg },
  data() {
    const store = geoStore();

    return {
      store,
      accuracy: 0,
      timeoutId: "",

      players: [],
    };
  },

  computed: {
    ...mapState(geoStore, {
      position: "position",
    }),

    ...mapState(gameStore, {
      roomId: "roomId",
      playerId: "playerId",
    }),
  },

  created() {
    this.getCurrPos();
  },

  mounted() {
    const seconds = 5;

    this.timeoutId = window.setInterval(() => {
      this.locate();
    }, seconds * 1000);
  },

  sockets: {
    connect: function () {
      console.log("socket connected");
    },

    // get surrounding objects
    "me/actors": function (data) {
      this.players = [];
      data.players.forEach((player) => {
        this.players.push(player);
      });
    },
  },

  methods: {
    locate() {
      this.getCurrPos();
    },

    getCurrPos() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.store.updatePosition(position.coords);
            this.accuracy = position.coords.accuracy;

            if (this.accuracy > 50) {
              this.accuracyInfo();
            }

            this.$socket.emit("game/get-actors", {
              playerId: this.playerId,
              roomId: this.roomId,
            });
            this.$socket.emit("game/location", {
              playerId: this.playerId,
              roomId: this.roomId,
              location: {
                lat: this.position.lat,
                lng: this.position.lng,
              },
            });
          },
          () => {
            this.locationError();
          }
        );
      } else {
        this.locationError();
      }
    },

    stopRefresh() {
      console.log("Stop refreshing location ...");
      clearTimeout(this.timeoutId);
    },

    accuracyInfo() {
      this.showToast("mapAccuracy");
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

<style>
#map-container,
.vue-map-container {
  height: 100%;
  overflow: hidden;
  border-radius: 15px;

  box-shadow: inset 0px 0px 20px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0px 0px 20px 5px rgba(0, 0, 0, 0.2);
}
#update-btn {
  z-index: 100;
  position: absolute;

  bottom: 30px;
  left: 30px;
}
#accuracy {
  z-index: 100;
  position: absolute;

  top: 30px;
  left: 30px;

  background-color: aliceblue;
  padding: 10px;
  border-radius: 5px;
}
</style>
