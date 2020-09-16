<template>
  <div class="modal" @click.self="close">
    <div class="modal__body">
      <slot />
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

