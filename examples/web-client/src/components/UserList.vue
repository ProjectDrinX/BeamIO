<script setup lang="ts">
import type { Users } from '../App.vue';
import UserIcon from './icons/user.vue';
import Writing from './icons/writing.vue';

defineProps<{
  users: Users;
}>();
</script>

<template>
  <div class="users">
    <div class="item" v-for="(user, k) in users" v-key="k">
      <div>
        <UserIcon v-if="!user.isWriting"/>
        <Writing v-else/>
        <div
          :style="{
            color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`,
          }"
        >
          {{ user.username }}
        </div>
      </div>
      <div v-if="user.latency !== undefined" class="ping">
        {{ user.latency }} ms
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff04;
  padding: 20px;
}

.item > div {
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin-top: 1px;
}

.ping {
  opacity: 0.4;
  font-size: 17px;
}
</style>
