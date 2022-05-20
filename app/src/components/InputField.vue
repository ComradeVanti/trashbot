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
      text: ""
    };
  },

  props: {
    placeholder: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "text"
    }
  },
  emits: ["textChanged", "keyup"]
};
</script>

<style>

input {
  width: 100%;
  border: 0;
  background: var(--col-input-background);
  font-weight: 700;
  font-size: var(--fnt-sze-label);
  color: var(--col-input);
  border-radius: var(--dim-corners);
  text-align: center;
  padding: var(--dim-small) var(--dim-regular);
}

input::placeholder {
  color: var(--col-input);
}

</style>
