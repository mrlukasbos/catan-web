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

<style scoped>
  .modal {
    width: 100vw;
    height: 100vw;
    background-color: rgba(200, 200, 200, 0.5);
    position:fixed;
    visibility: hidden;
    transition: visibility .3s, opacity .3s;
    opacity: 0;
    z-index: 999;
    justify-content: center;
  }

  .modal--visible {
    visibility: visible;
    opacity: 1;
  }

  .modal__body {
    margin-top: 20%;
    padding: 50px;
    background-color: white;
  }

  .modal__body button:not(:last-child) {
    margin-right: 1px;
  }
</style>

