<template>
  <div class="fill-parent">
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
        <user-pin @openWindow="openInfoWindow(playerId)" />
        <playground-circle />

        <GMapCluster>
          <enemy-pin
            v-for="player in players"
            :key="player['id']"
            :position="player['location']"
            @openWindow="openInfoWindow(player['id'])"
          />
        </GMapCluster>

        <GMapCluster>
          <item-pin v-for="item in items" :key="item['id']" :object="item" />
        </GMapCluster>
      </GMapMap>
    </div>

    <div id="accuracy">Ungenauigkeit: {{ accuracy }}m</div>
    <timer-component :time="time" />
  </div>

  <button-comp
    v-if="itemInRange == true"
    class="pickUpItem"
    @click="openItemWindow()"
    >Item aufheben</button-comp
  >

  <item-window :userId="selectedUser"></item-window>
  <info-window :robotParts="robot" />

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
import ItemPin from "../components/ItemPin.vue";
import ToastMsg from "../components/ToastMsg.vue";
import InfoWindow from "../components/InfoWindow.vue";
import PlaygroundCircle from "../components/PlaygroundCircle.vue";
import TimerComponent from "../components/TimerComponent.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import ItemWindow from "@/components/ItemWindow.vue";

export default {
  name: "GameView",
  components: {
    UserPin,
    EnemyPin,
    ItemPin,
    ToastMsg,
    InfoWindow,
    PlaygroundCircle,
    TimerComponent,
    ButtonComp,
    ItemWindow,
  },
  data() {
    const locationStore = geoStore();
    const userStore = gameStore();

    return {
      userStore,
      locationStore,
      accuracy: 0,
      robot: {
        head: {
          coolness: null,
          range: null,
        },
        body: {
          coolness: null,
          range: null,
        },
        arms: {
          coolness: null,
          range: null,
        },
        legs: {
          coolness: null,
          range: null,
        },
      },
      ASK_SEC: 5,

      players: [],
      items: [],
      itemInRange: false,
      itemsInRange: [],
    };
  },

  computed: {
    ...mapState(geoStore, {
      position: "position",
    }),

    ...mapState(gameStore, {
      roomId: "roomId",
      playerId: "playerId",
      time: "time",
    }),
  },

  created() {
    this.getCurrPos();
    this.checkIfUserIsLoggedIn();
  },

  mounted() {
    window.setInterval(() => {
      this.askEnemy();
    }, this.ASK_SEC * 1000);
  },

  sockets: {
    connect: function () {
      console.log("socket connected");
    },

    // get surrounding objects
    "me/actors": function (data) {
      this.players = data.players;
      this.items = data.items;
    },

    "me/items-in-range": function (data) {
      // todo: add logic for multiple items
      if (data[0] && data.length > 0) {
        data.forEach((item) => {
          this.itemsInRange.push(item.id);
        });
        this.itemInRange = true;
      } else {
        this.itemInRange = false;
      }
    },

    // response to open info window
    "me/robot": function (data) {
      this.robot = data.robot;
      const dialog = document.querySelector("#detailPage.modal");
      dialog.style.display = "flex";
    },

    // end game
    "game/done": function () {
      console.log("end");
      this.$router.push("end");
    },
  },

  methods: {
    getCurrPos() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.locationStore.updatePosition(position.coords);
            this.accuracy = position.coords.accuracy;

            if (this.accuracy > 50) {
              this.accuracyInfo();
            }

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
    askEnemy() {
      this.$socket.emit("game/get-actors", {
        playerId: this.playerId,
        roomId: this.roomId,
      });
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

    checkIfUserIsLoggedIn() {
      if (!localStorage.getItem("playerId")) {
        console.log("not");
        this.$router.push("/");
      } else {
        console.log("loggedin");
        this.userStore.savePlayerId(parseInt(localStorage.getItem("playerId")));
        this.userStore.savePlayer(localStorage.getItem("playerName"));
        this.userStore.saveRoomId(parseInt(localStorage.getItem("roomId")));
      }
    },

    openInfoWindow(id) {
      this.$socket.emit("game/robot", {
        playerId: id,
        roomId: parseInt(this.roomId),
      });
    },

    openItemWindow(id) {
      console.log("test");
      this.selectedUser = id;
      const itemDialog = document.querySelector("#itemPage.modal");
      itemDialog.style.display = "flex";
    },
  },
};
</script>

<style scoped>
#map-container,
.vue-map-container {
  height: 100%;
  overflow: hidden;
  border-radius: var(--dim-corners);
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

.content {
  padding: 0 !important;
}

.pickUpItem {
  z-index: 100;
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  margin: auto;
  width: 50%;
}
</style>
