<script setup lang="ts">
import socket from '../net';
import type { User, Settings, Color } from '../App.vue';

defineProps<{
  user: User;
  settings: Settings;
  open: boolean;
}>();
</script>

<template>
  <div class="modal" :class="{ open }">
    <div class="item">
      <div>User color</div>
      <input type="color" v-model="uColor" />
    </div>
    <div class="item">
      <div>Background color</div>
      <input type="color" v-model="bgColor" />
    </div>
    <div class="bigButton" @click="$router.push('/login')">Change username</div>
  </div>
</template>

<script lang="ts">
export default {
  data: () =>
    ({
      uColor: '',
      bgColor: '',
      lastPush: Date.now(),
    }) as {
      uColor: string;
      bgColor: string;
      lastPush: number;
    },

  mounted() {
    this.uColor = this.toHex(this.user.color);
    this.bgColor = this.toHex(this.settings.bgColor);
  },

  watch: {
    uColor() {
      const now = Date.now();
      if (now - this.lastPush < 50) return;
      this.lastPush = now;

      this.user.color = {
        r: this.toDec(this.uColor.slice(1, 3)),
        g: this.toDec(this.uColor.slice(3, 5)),
        b: this.toDec(this.uColor.slice(5, 7)),
      };

      socket.emit('setUsernameColor', this.user.color);

      localStorage.setItem('color', JSON.stringify(this.user.color));
    },

    bgColor() {
      const now = Date.now();
      if (now - this.lastPush < 50) return;
      this.lastPush = now;

      this.settings.bgColor = {
        r: this.toDec(this.bgColor.slice(1, 3)),
        g: this.toDec(this.bgColor.slice(3, 5)),
        b: this.toDec(this.bgColor.slice(5, 7)),
      };

      socket.emit('setBackgroundColor', this.settings.bgColor);
    },
  },

  methods: {
    toHex({ r, g, b }: Color) {
      return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    },
    toDec(hex: string) {
      return ~~`0x${hex}`;
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  right: -350px;
  top: 70px;
  padding: 20px;
  background-color: #ffffff08;
  box-shadow: #0000001a 0 0 14px 0px;

  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.modal.open {
  right: 11px;
}

.item {
  display: flex;
  justify-content: space-between;
  column-gap: 40px;
}

.bigButton {
  background-color: #0000005a;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

input[type='color'] {
  padding: 0;
  background-color: transparent;
}
</style>
