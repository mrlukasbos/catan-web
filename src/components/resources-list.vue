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

<style scoped>
  .resources-list {
    display: flex;
  }

  .resources-list--medium .resources-list__resource {
    width: 36px;
    height: 56px;
  }

  .resources-list--large .resources-list__resource {
    width: 54px;
    height: 84px;
  }

  .resources-list__resource {
    font-weight: 100;
    width: 18px;
    height: 28px;
    border-radius: 5%;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: .5px solid gainsboro;
  }
</style>
