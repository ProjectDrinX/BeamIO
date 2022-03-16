<script setup lang="ts">
import { RouterView } from 'vue-router';
import socket, { Schemes } from './net';
</script>

<template>
  <RouterView :messages="messages" :users="users" :user="user"/>
</template>

<script lang="ts">
type UID = number;

export interface User {
  username: string,
  color: {
    r: number,
    g: number,
    b: number,
  },
};

export interface Users { [uUID: UID]: User };

export interface Message {
  sender: UID,
  message: string,
}

export default {
  data: () => ({
    user: {
      username: localStorage.getItem('username'),
      color: JSON.parse(localStorage.getItem('color') ?? 'null') ?? {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      },
    },
    users: {},
    messages: [],
  }) as {
    user: User,
    users: Users,
    messages: Message[],
  },
  mounted() {
    socket.on('userConnected', (data: typeof Schemes.userConnected) => {
      this.users[data.uUID] = {
        username: data.username,
        color: data.color,
      };
    });

    socket.on('messageEvent', (data: typeof Schemes.messageEvent) => {
      this.messages.push(data);
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
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Questrial&display=swap');

:root {
  --bg: #181818;
  --font: #cacaca;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  background-color: var(--bg);
  font-family: Questrial, Arial, sans-serif;
}

body * {
  color: var(--font);
  font-size: 25px;
  transition-duration: 100ms;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  text-shadow: 0 0 2px #00000020;
}

*:not(input),
input[type=submit] { user-select: none }

input {
  outline: none;
  border: none;
}

::placeholder { color: #cacaca }

</style>
