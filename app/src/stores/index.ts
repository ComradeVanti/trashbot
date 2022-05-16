import { defineStore } from "pinia";

export const geoStore = defineStore("geo", {
  state: () => ({
    position: { lat: 0, lng: 0 },
  }),
  actions: {
    updatePosition(position: {
      latitude: Float32Array;
      longitude: Float32Array;
    }) {
      return { lat: position.latitude, lng: position.longitude };
    },
  },
});
