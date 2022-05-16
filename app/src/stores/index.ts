import { defineStore } from "pinia";

export const geoStore = defineStore("geo", {
  state: () => ({
    position: { lat: 0, lng: 0 },
  }),
  actions: {
    updatePosition() {
      return { lat: 48.21374736968008, lng: 15.631398983130056 };
    },
  },
});
