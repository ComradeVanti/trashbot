<template>
  <div class="input-group">
    <input
      type="text"
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

<style>

input {
  width: 100%;
  border: 0;
  background: #D8DAD9;
  font-weight: 700;
  font-size: 17px;
  border-radius: 40px;
  color: white;
  text-align: center;
  padding: 10px 20px;
}
</style>
