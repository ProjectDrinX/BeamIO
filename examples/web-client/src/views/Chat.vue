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
    <div>Connected as</div>
    <div v-bind:style="{
      color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`
    }">{{ user.username }}</div>
  </div>
  <UserList class="sidebar" :users="users"/>
  <div class="container">
    <div class="messages" ref="messages">
      <div v-for="(msg, i) in messages">
        <div class="username" v-if="!messages[i - 1] || messages[i - 1].sender !== msg.sender" v-bind:style="{
          color: users[msg.sender]
            ? `rgb(${users[msg.sender].color.r}, ${users[msg.sender].color.g}, ${users[msg.sender].color.b})`
            : '#888',
          'font-style': users[msg.sender] ? 'normal' : 'italic',
        }">
          {{ users[msg.sender] ? users[msg.sender].username : `Disconnected (${msg.sender})` }}
        </div>
        <div class="message">{{ msg.message }}</div>
      </div>
    </div>

    <form class="textbox" @submit="sendMessage">
      <input type="text" v-model="message" placeholder="Message">
    </form>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    message: '',
  }) as {
    message: string,
  },

  mounted() {
    this.scrollDown(true);
  },

  methods: {
    scrollDown(force = false) {
      // @ts-ignore
      const container: HTMLElement = this.$refs.messages;

      if (
        !force
        && (container.scrollHeight - container.scrollTop - container.clientHeight) > 10
      ) return;

      setTimeout(() => {
        container.scrollTo(0, 10 ** 10);
      }, 0);
    },

    sendMessage(e: Event) {
      e.preventDefault();
      if (!this.message) return;

      socket.emit('sendMessage', {
        message: this.message,
      } as typeof Schemes.sendMessage);

      this.message = '';
      this.scrollDown(true);
    },
  },

  watch: {
    ['messages.length']() {
      this.scrollDown();
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
  background-color: #ffffff14;

  display: flex;
  align-items: center;
  padding: 20px;
  column-gap: 6px;

  z-index: 10;
}

.sidebar {
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  width: 400px;
  background-color: #ffffff08;
}

.container {
  position: fixed;
  top: 70px;
  bottom: 50px;
  left: 400px;
  right: 0;
}

.messages {
  padding: 10px 20px 20px;
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
}

.message {
  margin-left: 15px;
  font-size: 23px;
}

.username {
  margin-top: 10px;
}

.textbox {
  position: fixed;
  left: 400px;
  right: 0;
  bottom: 0;
  height: 50px;
}

.textbox > input {
  height: 100%;
  width: 100%;
  padding: 10px 20px;
  background-color: #ffffff1c;
}
</style>
