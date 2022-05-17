import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import VueSocketIO from "vue-3-ts-socket.io";

const app = createApp(App);
app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAq2_cmvceXQPpMJ_i_aiNirQCiU0XiCGw",
  },
});

app.use(router);
app.use(createPinia());

app.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:3000",
  })
);

app.mount("#app");
