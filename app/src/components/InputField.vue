<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      :aria-label="label"
      aria-describedby="basic-addon1"
      v-model="text"
    />
  </div>
</template>

<script>
export default {
  name: "InputField",
  data() {
    return {
      text: "",
    };
  },

  props: {
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "text",
    },
  },
  emits: ["textChanged", "keyup"],
};
</script>

<style></style>
