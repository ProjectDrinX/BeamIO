<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="loader">
    <svg viewBox="0 0 100 100">
      <circle
        fill="none"
        stroke="#aaa"
        stroke-width="4"
        cx="50"
        cy="50"
        r="44"
        style="opacity: 0.5"
      />
      <circle
        fill="#aaa"
        stroke="#181818"
        stroke-width="3"
        cx="8"
        cy="54"
        r="6"
      >
        <animateTransform
          attributeName="transform"
          dur="2s"
          type="rotate"
          from="0 50 48"
          to="360 50 52"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts"></script>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  background-color: #181818;
  z-index: 1000000;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 30px;
}

svg {
  height: 80px;
}
svg * {
  transition-duration: initial;
}
</style>
