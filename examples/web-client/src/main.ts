import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import socket, { Schemes } from './net';

// @ts-ignore
const app = createApp(App);

app.use(router);

socket.on('connect', () => {
  const username = localStorage.getItem('username');
  if (username) socket.emit('setUsername', { username } as typeof Schemes.setUsername);

  const color = JSON.parse(localStorage.getItem('color') ?? 'null') ?? {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };

  socket.emit('setUsernameColor', color as typeof Schemes.setUsernameColor);
});

app.mount('#app');
