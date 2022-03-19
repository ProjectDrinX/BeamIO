<template>
  <svg height="40" width="40">
    <circle class="dot" cx="10" cy="20" r="3"/>
    <circle class="dot" cx="20" cy="20" r="3"/>
    <circle class="dot" cx="30" cy="20" r="3"/>
  </svg>
</template>

<style scoped>
svg {
  height: 40px;
  fill: #e2e2e2;
}

@keyframes blink {
  50% {
    fill: transparent;
  }
}
.dot {
  animation: 1s blink infinite;
  fill: #ffffff52;
}
.dot:nth-child(2) {
  animation-delay: 250ms;
}
.dot:nth-child(3) {
  animation-delay: 500ms;
}
</style>
