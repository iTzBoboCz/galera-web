<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  id: String,
});
</script>

<template>
  <p>{{ id }}</p>
</template>
