<template>
  <div class="content">
    <div id="map-container">
      <GMapMap id="map" :zoom="15" :center="position">
        <user-pin />
      </GMapMap>
    </div>

    <button
      id="update-btn"
      class="btn btn-primary"
      type="button"
      @click="getCurrPos()"
    >
      Aktualisiere Standort
    </button>
  </div>

  <toast-msg
    id="locationError"
    msg="Standort nicht gefunden. Überprüfe deine Standorteinstellungen."
    bgColor="danger"
  />
</template>

<script>
import { mapState } from "pinia";
import { geoStore } from "../stores/index.ts";

import UserPin from "../components/UserPin.vue";
import ToastMsg from "../components/ToastMsg.vue";

export default {
  name: "GameView",
  components: { UserPin, ToastMsg },
  setup() {
    const store = geoStore();

    return {
      store,
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
  methods: {
    getCurrPos() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.store.updatePosition(position.coords);
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
</style>
