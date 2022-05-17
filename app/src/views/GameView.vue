<template>
  <GMapMap
    :center="position"
    :zoom="15"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
  >
    <user-pin />
  </GMapMap>
  <button type="button" class="btn btn-primary" @click="getCurrPos()">
    update
  </button>

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
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
