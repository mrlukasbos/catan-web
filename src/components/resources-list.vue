<template>
  <div class="resources-list" :class="sizeClass">
    <div v-for="resource in resources" :key="resource.id" class="resources-list__resource" :class="resource.type">
      {{ resource.value }}
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
// import { Resource } from '../type/resource';

export default Vue.extend({
  props: {
    resources: {
      type: Array,
      default: new Array,
    },
    size: {
      type: Number,
      default: 0
    },
  },
  computed: {
    sizeClass: function (): string {
      if (this.size == null) {
        return 'resources-list--small'
      } else {
        return `resources-list--${this.size}`
      }
    }
  }
});
</script>
