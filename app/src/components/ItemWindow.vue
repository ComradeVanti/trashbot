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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";

export default {
  name: "ItemWindow",
  data() {
    return {};
  },
  props: ["itemInfo"],
  computed: {
    ...mapState(gameStore, {
      playerName: "playerName",
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
    closeWindow() {
      console.log(this.itemInfo);
      const itemDialog = document.querySelector("#itemPage.modal");
      localStorage.removeItem("itemInfo");
      itemDialog.style.display = "none";
    },
  },
};
</script>

<style>
.fade:not(.show) {
  opacity: 1;
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
</style>
