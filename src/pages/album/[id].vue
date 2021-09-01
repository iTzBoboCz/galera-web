<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false,
      default: "d",
    },
  },
});
</script>

<template>
  <p>{{ id }}</p>
</template>
