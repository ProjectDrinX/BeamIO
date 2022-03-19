<script setup lang="ts">
import socket, { Schemes } from '../net';
</script>

<template>
  <form @submit="setUsername">
    <input type="text" placeholder="Username" v-model="username" required/>
  </form>
</template>

<script lang="ts">
export default {
  data: () =>
    ({
      username: '',
    } as {
      username: string;
    }),

  mounted() {
    this.username = localStorage.getItem('username') ?? '';
  },

  methods: {
    setUsername(e: Event) {
      e.preventDefault();

      if (!this.username) {
        alert('Please enter a username');
        return;
      }

      if (this.username.length > 15) {
        alert('This username is too long');
        return;
      }

      localStorage.setItem('username', this.username);
      localStorage.setItem(
        'color',
        JSON.stringify({
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        }),
      );

      socket.emit('setUsername', {
        username: this.username,
      } as typeof Schemes.setUsername);

      this.$router.push({ path: '/' });
    },
  },
};
</script>

<style scoped>
form {
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  text-align: center;
  font-size: 30px;
  padding: 5px 0px;
  background-color: transparent;
  border-bottom: 6px solid #ffffff;
}

input:focus {
  border-bottom-width: 4px;
}
</style>
