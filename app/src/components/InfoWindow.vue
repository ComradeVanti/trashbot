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
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeWindow"
          ></button>
        </div>
        <div class="modal-body">Hier steht der Inhalt</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeWindow">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoWindow",
  methods: {
    closeWindow() {
      const dialog = document.querySelector("#detailPage.modal");
      dialog.style.display = "none";
    },
  },
};
</script>

<style>
.fade:not(.show) {
  opacity: 1;
}
</style>
