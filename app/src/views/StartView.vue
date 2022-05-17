<template>
  <main>Hello World</main>
  <!-- <Button @click="clickButton">Test</Button> -->
</template>

<script>
export default {
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
