<template>
  <div
    class="toast align-items-center bg-primary text-white border-0"
    :class="[bgColorClass, textColorClass]"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToastMsg",
  props: {
    msg: {
      type: String,
      default: "default msg",
    },
    bgColor: {
      type: String,
      default: "primary",
    },
    textColor: {
      type: String,
      default: "white",
    },
  },
  computed: {
    bgColorClass() {
      let val = "";
      if (this.bgColor) {
        val = `bg-${this.bgColor}`;
      }
      return val;
    },
    textColorClass() {
      let val = "";
      if (this.textColor) {
        val = `text-${this.textColor}`;
      }
      return val;
    },
  },
};
</script>

<style>
.toast {
  position: absolute;
  top: 0;
  left: 0;
  margin: 20px;
}
</style>
