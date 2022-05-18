import { defineStore } from "pinia";

export const geoStore = defineStore("geo", {
  state: () => ({
    position: { lat: 0, lng: 0 },
  }),
  actions: {
    updatePosition(position: { latitude: number; longitude: number }) {
      this.position = { lat: position.latitude, lng: position.longitude };
    },
  },
  getters: {
    newPosition: (state) => state.position,
  },
});

export const gameStore = defineStore("game", {
  state: () => ({
    playerId: 1230,
    playerName: "playerName",
    roomId: 1230,
  }),
  actions: {
    savePlayer(updatedName: string) {
      this.playerName = updatedName;
    },
    savePlayerId(updatedId: number) {
      this.playerId = updatedId;
    },
    saveRoomId(lobbyCode: number) {
      this.roomId = lobbyCode;
    },
  },
  getters: {
    updatedName: (state) => state.playerName,
    updatedId: (state) => state.playerId,
  },
});
