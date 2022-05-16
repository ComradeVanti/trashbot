import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'


const app = createApp(App)
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAq2_cmvceXQPpMJ_i_aiNirQCiU0XiCGw',
    },
});

app.use(router)

app.mount('#app')
