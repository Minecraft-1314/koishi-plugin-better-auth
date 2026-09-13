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
    class="k-icon k-icon-mobile"
    :width="size"
    :height="size"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path d="M16 64C16 28.65 44.65 0 80 0H304C339.3 0 368 28.65 368 64V448C368 483.3 339.3 512 304 512H80C44.65 512 16 483.3 16 448V64zM224 448C224 434.7 213.3 424 200 424C186.7 424 176 434.7 176 448C176 461.3 186.7 472 200 472C213.3 472 224 461.3 224 448zM112 64V96H272V64H112z" />
  </svg>
</template>