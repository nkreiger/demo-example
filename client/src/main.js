import Vue from 'vue'
import App from './App.vue'
//import io from 'socket.io-client';

// export const socket = io('localhost:8000');
// // eslint-disable-next-line no-console
// console.log(socket);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
