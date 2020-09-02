<template>
  <div class="resources-list" v-bind:class="sizeClass">
    <div v-for="resource in resources" :key="resource.id" class="resources-list__resource" v-bind:class="resource.type"> {{resource.value}} </div>
  </div>
</template>

<script>
  export default {
    props: ['resources', 'size'],
    computed: {
      sizeClass: function () {
        if (this.size == null) {
          return 'resources-list--small'
        } else {
          return `resources-list--${this.size}`
        }
      }
    }
  }
</script>
