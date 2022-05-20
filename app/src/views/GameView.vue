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
    @click="openItemWindow(itemsInRange[0].id)"
    >Item aufheben</button-comp
  >

  <item-window v-if="itemInRange == true" :itemInfo="itemInfo"></item-window>
  <info-window :robotParts="robot" />

  <toast-msg
    id="locationError"
    msg="Standort nicht gefunden. Überprüfe deine Standorteinstellungen."
    bgColor="danger"
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
      timeout: "",
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
      itemInfo: {
        id: 1,
        type: null,
        states: {
          range: null,
          coolness: null,
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
    this.timeout = window.setInterval(() => {
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
      console.log(data);
      if (data[0] && data.length > 0) {
        data.forEach((item) => {
          this.itemsInRange.push(item);
        });
        this.itemInRange = true;
      } else {
        this.itemInRange = false;
      }
      this.itemInfo = data;
    },

    // response to open info window
    "me/robot": function (data) {
      this.robot = data.robot;
      const dialog = document.querySelector("#detailPage.modal");
      dialog.style.display = "flex";
    },

    // end game
    "game/done": function () {
      clearInterval(this.timeout);
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
      console.log(this.itemsInRange);
      this.itemsInRange[0].id = id;
      localStorage.setItem("itemInfo", JSON.stringify(this.itemsInRange));
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
