import { defineStore } from "pinia";

export const geoStore = defineStore("geo", {
  state: () => ({
    position: { lat: 0, lng: 0 },
  }),
  actions: {
    updatePosition(position: { latitude: number; longitude: number }) {
      this.position = { lat: position.latitude, lng: position.longitude };
      console.log(this.position);
    },
  },
  getters: {
    newPosition: (state) => state.position,
  },
});
