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

<style>
.form-control{
  background: #D8DAD9;
  border-radius: 40px;
  font-weight: 700;
  font-size: 20px;
  color: white;
  text-align: center;
}
.form-control,input{
  background: #D8DAD9;
  border-radius: 40px;
  font-weight: 700;
  font-size: 17px;
  color: white;
  text-align: center;
}
</style>
