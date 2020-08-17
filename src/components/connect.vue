<template>
  <div>
    <input placeholder="Ip address" v-model="ip" v-on:keyup.enter="connect"/>
    <input placeholder="port" v-model="port" v-on:keyup.enter="connect"/>
    <button v-on:click="connect"> Connect </button>
  </div>
</template>

<script>
export default {
  name: 'connect',
  data: function() {
    return {
      ip: "localhost",
      port: 10007,
    }
  },
  methods: {
    connect: function() {
      this.$emit("connect", this.ip, this.port);
    }
  }
}
</script>

<style scoped>

</style>
