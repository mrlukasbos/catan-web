<template>
  <div class="modal" v-bind:class="visibleClass">
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
  }
}
</script>

