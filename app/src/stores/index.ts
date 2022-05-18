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
    roomId: 0,
    position: { lat: 0, lng: 0 },
    actors: {
      playerId: 0,
      actorPosition: { lat: 0, lng: 0 },
    },
  }),
  actions: {
    savePlayer(updatedName: string) {
      console.log("asdf1");
      this.playerName = updatedName;
    },
    saveRoomId(lobbyCode: number) {
      console.log("roomId");
      this.roomId = lobbyCode;
    },
  },
  getters: {
    updatedName: (state) => state.playerName,
  },
});
