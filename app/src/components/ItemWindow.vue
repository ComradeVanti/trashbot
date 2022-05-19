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
          <h5 class="modal-title" id="exampleModalLabel">{{ userId }}</h5>
          <div
            class="interaction close"
            aria-label="Close"
            @click="closeWindow"
          >
            <i class="bi bi-x-circle"></i>
          </div>
        </div>

        <div class="modal-body">Item Stats</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";

export default {
  name: "ItemWindow",
  props: ["userId"],
  computed: {
    ...mapState(gameStore, {
      playerName: "playerName",
    }),
  },

  methods: {
    closeWindow() {
      const itemDialog = document.querySelector("#itemPage.modal");
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
