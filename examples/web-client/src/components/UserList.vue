<script setup lang="ts">
import type { Users } from '../App.vue';

defineProps<{
  users: Users,
}>();
</script>

<template>
  <div class="users">
    <div class="item" v-for="user in users" v-bind:style="{ color: `rgb(${user.color.r}, ${user.color.g}, ${user.color.b})` }">
      {{ user.username }}
    </div>
  </div>
</template>

<style scoped>
.users {

}
</style>
