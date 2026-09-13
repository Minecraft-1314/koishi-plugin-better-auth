<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  color?: string
}>(), {
  size: 24,
  color: 'currentColor',
})
</script>

<template>
  <svg
    class="k-icon k-icon-clock"
    :width="size"
    :height="size"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.3 275.1L330.3 339.1C338.2 345.3 348.5 343.3 354.8 335.4C361.1 327.4 359.1 317.2 351.2 310.9L264.1 247.1C264 247.4 264 246.8 264 246.8V128C264 113.1 254 104 240 104C226 104 216 113.1 216 128V256z" />
  </svg>
</template>