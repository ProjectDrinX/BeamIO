<script setup lang="ts">
import { RouterView } from 'vue-router';
import Loader from './components/Loader.vue';
import socket, { Schemes } from './net';
</script>

<template>
  <div>
    <Loader v-if="loading" :message="loading"/>
    <RouterView
      :messages="messages"
      :users="users"
      :user="user"
      :settings="settings"
    />
  </div>
</template>

<script lang="ts">
export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Settings {
  bgColor: Color;
}

export interface User {
  username: string;
  color: Color;
  isWriting?: boolean;
  latency?: number;
}

type UID = number;
export interface Users {
  [uUID: UID]: User;
}

export interface Message {
  sender: UID;
  message: string;
}

export default {
  data: () => ({
    loading: 'Creating BeamIO endpont...',

    user: {
      username: localStorage.getItem('username') ?? '',
      color: JSON.parse(localStorage.getItem('color') ?? 'null') ?? {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      },
    },
    settings: {
      bgColor: { r: 24, g: 24, b: 24 },
    },
    users: {},
    messages: [],
  } as {
    loading: string;
    user: User;
    settings: Settings;
    users: Users;
    messages: Message[];
  }),

  beforeCreate() {
    socket.on('connect', () => {
      const username = localStorage.getItem('username');
      if (username)
        socket.emit('setUsername', { username } as typeof Schemes.setUsername);

      const color = JSON.parse(localStorage.getItem('color') ?? 'null') ?? {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      };

      socket.emit('setUsernameColor', color as typeof Schemes.setUsernameColor);

      this.loading = '';
    });

    socket.on('disconnect', () => {
      this.loading = 'Reconnecting...';
    });
  },

  mounted() {
    if (this.loading) this.loading = 'Connecting...';

    socket.on('userConnected', (data: typeof Schemes.userConnected) => {
      this.users[data.uUID] = {
        username: data.username,
        color: data.color,
      };
    });

    socket.on(
      'changeBackgroundColor',
      (data: typeof Schemes.changeBackgroundColor) => {
        this.settings.bgColor = data;
      },
    );

    socket.on('messageEvent', (data: typeof Schemes.messageEvent) => {
      this.users[data.sender].isWriting = false;
      this.messages.push(data);
    });

    socket.on('userWritingStatus', (data: typeof Schemes.userWritingStatus) => {
      this.users[data.uUID].isWriting = data.status;
    });

    socket.on('userLatency', (data: typeof Schemes.userLatency) => {
      this.users[data.uUID].latency = data.latency;
    });

    socket.on('userRenamed', (data: typeof Schemes.userRenamed) => {
      this.users[data.uUID].username = data.username;
    });

    socket.on('userChangeColor', (data: typeof Schemes.userChangeColor) => {
      this.users[data.uUID].color = data.color;
    });

    socket.on('userDisconnected', (data: typeof Schemes.userDisconnected) => {
      delete this.users[data.uUID];
    });

    socket.on('ping', () => {
      socket.emit('ping', {});
    });
  },

  watch: {
    ['settings.bgColor']() {
      document.body.style.backgroundColor = `rgb(${this.settings.bgColor.r},${this.settings.bgColor.g},${this.settings.bgColor.b})`;
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Questrial&display=swap');

:root {
  --font: #cacaca;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  /* background-color: #000; */
  font-family: Questrial, Arial, sans-serif;
}

body * {
  color: var(--font);
  font-size: 25px;
  transition-duration: 50ms;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  text-shadow: 0 0 2px #00000020;
}

*:not(input),
input[type='submit'] {
  user-select: none;
}

input {
  outline: none;
  border: none;
}

::placeholder {
  color: #cacaca;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #ffffff14;
}
::-webkit-scrollbar-thumb {
  background: #ffffff09;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff14;
}
</style>
