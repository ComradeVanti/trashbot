<template>
  <!-- <main>Hello World</main> -->

  <input-field aria-label="Name" placeholder="Name"></input-field>
  <input-field aria-label="Lobby Code" placeholder="Lobby Code"></input-field>

  <br />

  <button-comp>Join</button-comp>
  <br />
  <br />
  <button-comp>Host</button-comp>
</template>

<script>
import InputField from "@/components/InputField.vue";
import ButtonComp from "@/components/ButtonComp.vue";
export default {
  components: { InputField, ButtonComp },
  name: "GameView",
  // setup() {},
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    // customEmit: function (data) {
    //   console.log(
    //     'this method was fired by the socket server. eg: io.emit("customEmit", data)'
    //   );
    // },
  },
  methods: {
    // clickButton: function (data) {
    //   // $socket is socket.io-client instance
    //   this.$socket.emit("emit_method", data);
    // },
  },
};
</script>
