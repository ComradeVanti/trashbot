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
import { geoStore } from "../stores/index.ts";

import UserPin from "../components/UserPin.vue";
import EnemyPin from "../components/EnemyPin.vue";
import ToastMsg from "../components/ToastMsg.vue";

export default {
  name: "GameView",
  components: { UserPin, EnemyPin, ToastMsg },
  setup() {
    const store = geoStore();

    return {
      store,
      accuracy: 0,
      timeoutId: "",

      players: [
        {
          id: 1234234,
          position: {
            lat: 48.211992021759514,
            lng: 15.62987263544636,
          },
        },
        {
          id: 43263256,
          position: {
            lat: 48.21358705490682,
            lng: 15.631356595173013,
          },
        },
        {
          id: 13241245,
          position: {
            lat: 48.212893919279736,
            lng: 15.63025436725125,
          },
        },
        {
          id: 2435356,
          position: {
            lat: 48.21163557355482,
            lng: 15.629415613645717,
          },
        },
      ],
    };
  },

  computed: {
    ...mapState(geoStore, {
      position: "newPosition",
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
