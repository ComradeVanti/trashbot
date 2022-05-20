<template>
  <div
    id="itemPage"
    class="modal fade"
    aria-labelledby="Detailbereich"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Item gefunden!</h5>
          <div
            class="interaction close"
            aria-label="Close"
            @click="closeWindow"
          >
            <i class="bi bi-x-circle"></i>
          </div>
        </div>

        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr>
                <th>Type:</th>
                <td>{{ itemType }}</td>
              </tr>
              <tr>
                <th>Coolness:</th>
                <td>{{ itemCoolness }}</td>
              </tr>
            </tbody>
          </table>
          <button-comp class="pickUpBtn btn-primary" @click="saveItem()">Item aufheben</button-comp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";
import ButtonComp from "./ButtonComp.vue";

export default {
  components: { ButtonComp },
  name: "ItemWindow",
  data() {
    const userStore = gameStore();
    return {
      userStore,
    };
  },
  props: ["itemInfo"],
  computed: {
    ...mapState(gameStore, {
      playerName: "playerName",
      inRange: "itemInRange",
    }),
    itemType() {
      console.log(this.itemInfo[0].type);
      switch (this.itemInfo[0].type) {
        case 0:
          return "Arme";
        case 1:
          return "Beine";
        case 2:
          return "Körper";
        case 3:
          return "Kopf";
        default:
          return "empty";
      }
    },
    itemCoolness() {
      return Math.round(this.itemInfo[0].states.coolness);
    },
  },

  methods: {
    saveItem() {
      this.$socket.emit("game/pick-up-item", {
        playerId: parseInt(localStorage.getItem("playerId")),
        roomId: parseInt(localStorage.getItem("roomId")),
        itemId: this.itemInfo[0].id,
      });
      this.closeWindow();
    },
    closeWindow() {
      this.userStore.updateItemInRange(false);
      console.log(this.itemInfo);
      const itemDialog = document.querySelector("#itemPage.modal");
      localStorage.removeItem("itemInfo");
      itemDialog.style.display = "none";
    },
  },
};
</script>

<style>
.modal-content {
  background-color: var(--col-background);
  color: var(--col-on-background);
  border-radius: var(--dim-corners);
  padding: var(--dim-regular);
  align-items: center;
}

.modal-header {
  width: 100%;
}

.bi-x-circle::before {
  color: var(--col-on-background);
}

.fade:not(.show) {
  opacity: 1;
}

td {
  color: var(--col-on-background);
}

th {
  color: var(--col-on-background);
}

p {
  text-align: center;
}

.modal {
  justify-content: center;
  
}
.modal-dialog {
  width: 80vw;
  margin: auto auto;
  transform: none !important;
}
.interaction {
  height: 45px;
  width: 45px;
}

table th {
  width: 45px;
}
.robot-img {
  height: 40px;
}

.pickUpBtn {
  width: 250px;
}
</style>
