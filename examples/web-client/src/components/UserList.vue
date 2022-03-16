<script setup lang="ts">
import type { Users } from '../App.vue';
import UserIcon from './icons/user.vue';

defineProps<{
  users: Users,
}>();
</script>

<template>
  <div class="users">
    <div class="item" v-for="user in users">
      <UserIcon/>
      <div v-bind:style="{ color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})` }">
        {{ user.username }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  padding: 20px;
  align-items: center;
  column-gap: 10px;
  background-color: #ffffff04;
  margin-top: 1px;
}
</style>
