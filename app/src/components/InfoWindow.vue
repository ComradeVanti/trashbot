<template>
  <div
    id="detailPage"
    class="modal fade"
    aria-labelledby="Detailbereich"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ playerName }}</h5>
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
                <th scope="row">
                  <img
                    src="../assets/img/robot/Head.png"
                    alt="Roboter Kopf"
                    class="robot-img head"
                  />
                </th>
                <td>Coolness: {{ Math.round(robotParts.head.coolness) }}</td>
              </tr>
              <tr>
                <th scope="row">
                  <img
                    src="../assets/img/robot/Body.png"
                    alt="Roboter Körper"
                    class="robot-img body"
                  />
                </th>
                <td>Coolness: {{ Math.round(robotParts.body.coolness) }}</td>
              </tr>
              <tr>
                <th scope="row">
                  <img
                    src="../assets/img/robot/Arm.png"
                    alt="Roboter Arm"
                    class="robot-img arm"
                  />
                </th>
                <td>Coolness: {{ Math.round(robotParts.arms.coolness) }}</td>
              </tr>
              <tr>
                <th scope="row">
                  <img
                    src="../assets/img/robot/Leg.png"
                    alt="Roboter Bein"
                    class="robot-img leg"
                  />
                </th>
                <td>Coolness: {{ Math.round(robotParts.legs.coolness) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p>Gesamte Coolness: {{ getCoolness() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { gameStore } from "../stores/index.ts";

export default {
  name: "InfoWindow",
  props: ["robotParts"],
  computed: {
    ...mapState(gameStore, {
      playerName: "playerName",
    }),
  },

  methods: {
    closeWindow() {
      const dialog = document.querySelector("#detailPage.modal");
      dialog.style.display = "none";
    },

    getCoolness() {
      return (
        Math.round(this.robotParts.head.coolness) +
        Math.round(this.robotParts.body.coolness) +
        Math.round(this.robotParts.arms.coolness) +
        Math.round(this.robotParts.legs.coolness)
      );
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
