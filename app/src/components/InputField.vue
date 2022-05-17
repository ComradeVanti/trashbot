<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      :aria-label="label"
      aria-describedby="basic-addon1"
    />
  </div>
</template>

<script>
export default {
  name: "InputField",
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
};
</script>

<style></style>
