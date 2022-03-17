import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import socket, { Schemes } from './net';

// @ts-ignore
const app = createApp(App);

app.use(router);

app.mount('#app');
