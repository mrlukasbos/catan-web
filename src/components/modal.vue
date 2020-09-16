<template>
  <div class="modal" v-bind:class="visibleClass" v-on:click.self="close">
    <div class="modal__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible'],
  computed: {
    visibleClass: function () {
      if (this.visible) {
        return 'modal--visible';
      }
      return '';
    }
  },
  methods: {
    close() {
      this.$emit("close")
    }
  }
}
</script>

