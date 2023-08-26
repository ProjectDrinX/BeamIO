<script setup lang="ts">
import UserList from '../components/UserList.vue';
import SettingsModal from '../components/SettingsModal.vue';
import SendButton from '../components/icons/sendIcon.vue';
import SettingsButton from '../components/icons/settingsIcon.vue';
import socket from '../net';
import type { Settings, User, Users, Message } from '../App.vue';

defineProps<{
  messages: Message[];
  users: Users;
  user: User;
  settings: Settings;
}>();
</script>

<template>
  <div class="topbar">
    <div class="title">
      <div>Connected as</div>
      <div
        v-bind:style="{
          color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`,
        }"
      >
        {{ user.username }}
      </div>
    </div>
    <SettingsButton @click="settingsOpen = !settingsOpen" />
  </div>

  <UserList class="sidebar" :users="users" />

  <div class="container">
    <div class="messages" ref="msgsContainer">
      <div v-for="(msg, i) in messages" :key="i">
        <div
          class="username"
          v-if="!messages[i - 1] || messages[i - 1].sender !== msg.sender"
          v-bind:style="{
            color: users[msg.sender]
              ? `rgb(${users[msg.sender].color.r}, ${
                  users[msg.sender].color.g
                }, ${users[msg.sender].color.b})`
              : '#888',
            'font-style': users[msg.sender] ? 'normal' : 'italic',
          }"
        >
          {{
            users[msg.sender]
              ? users[msg.sender].username
              : `Disconnected (${msg.sender})`
          }}
        </div>
        <div class="message">{{ msg.message }}</div>
      </div>
    </div>

    <form class="textbox" @submit="sendMessage">
      <input
        type="text"
        ref="message"
        v-model="message"
        placeholder="Message"
        @beforeinput="setWritingStatus"
        autofocus
      />
      <SendButton class="sendButton" @click="sendMessage" />
    </form>
  </div>

  <SettingsModal :user="user" :settings="settings" :open="settingsOpen" />
</template>

<script lang="ts">
export default {
  data: () =>
    ({
      message: '',
      settingsOpen: false,
    }) as {
      message: string;
      settingsOpen: boolean;
    },

  mounted() {
    this.scrollDown(true);
    this.user.username = localStorage.getItem('username') ?? '';
    (this.$refs.message as HTMLInputElement).focus();
  },

  methods: {
    scrollDown(force = false) {
      // @ts-expect-error Refs are not typed
      const container: HTMLElement = this.$refs.msgsContainer;

      if (
        !force &&
        container.scrollHeight - container.scrollTop - container.clientHeight >
          10
      )
        return;

      setTimeout(() => {
        container.scrollTo(0, 10 ** 10);
      }, 0);
    },

    sendMessage(e: Event) {
      e.preventDefault();
      if (!this.message) return;

      socket.emit('sendMessage', {
        message: this.message,
      });

      this.message = '';
      this.scrollDown(true);
    },

    setWritingStatus() {
      socket.emit('chatWrite', {});
    },
  },

  watch: {
    ['messages.length']() {
      this.scrollDown();
    },
  },
};
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
  justify-content: space-between;
  padding: 20px;

  z-index: 10;
}

.topbar > .title {
  display: flex;
  column-gap: 6px;
}

.sidebar {
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  width: 400px;
  overflow: hidden;
  overflow-y: scroll;
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
  margin-top: 5px;
  font-size: 23px;
  max-width: 600px;
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

.sendButton {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
