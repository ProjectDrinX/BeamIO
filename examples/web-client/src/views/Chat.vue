<script setup lang="ts">
import UserList from '../components/UserList.vue';
import type { User, Users, Message } from '../App.vue';
import socket, { Schemes } from '../net';

defineProps<{
  messages: Message[],
  user: User,
  users: Users,
}>()
</script>

<template>
  <div class="topbar">
    Connected as
    <div v-bind:style="{
      color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`
    }">{{ user.username }}</div>
  </div>
  <UserList class="sidebar" :users="users"/>
  <div class="container">
    <div class="messages">
      <div v-for="(msg, i) in messages">
        <div v-if="!messages[i - 1] || messages[i - 1].sender !== msg.sender" v-bind:style="{
          color: `rgb(${users[msg.sender].color.r}, ${users[msg.sender].color.g}, ${users[msg.sender].color.b})`
        }">
          {{ users[msg.sender].username }}
        </div>
        <div class="message">{{ msg.message }}</div>
      </div>
    </div>
    <div class="textbox">
      <form @submit="sendMessage">
        <input type="text" v-model="message" placeholder="Message">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    message: '',
  }) as {
    message: string,
  },

  methods: {
    sendMessage() {
      socket.emit('sendMessage', {
        message: this.message,
      } as typeof Schemes.sendMessage);
    },
  },
}
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: beige;
}

.sidebar {
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  width: 400px;
}

.container {
  margin-top: 70px;
  margin-left: 400px;
}

.message {
  margin-left: 15px;
  font-size: 23px;
}

.textbox {
  position: fixed;
  left: 400px;
  right: 0;
  bottom: 0;
}
</style>
