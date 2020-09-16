<template>
  <div class="modal" v-on:click.self="close">
    <div class="modal__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit("close")
    }
  }
}
</script>

