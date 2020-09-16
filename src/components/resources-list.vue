<template>
  <div
    class="resources-list"
    :class="sizeClass"
  >
    <div
      v-for="resource in resources"
      :key="resource.id"
      class="resources-list__resource"
      :class="resource.type"
    >
      {{ resource.value }}
    </div>
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
