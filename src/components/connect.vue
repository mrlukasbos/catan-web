<template>
  <div>
    <input v-if="!connected" v-model="ip" placeholder="Ip address" @keyup.enter="connect">
    <input v-if="!connected" v-model="port" placeholder="port" @keyup.enter="connect">
    <a v-if="connected" class="control clickable" @click="disconnect"> {{ T("DISCONNECT") }} </a>
    <a v-else class="control clickable" @click="connect"> {{ T("CONNECT") }} </a>
  </div>
</template>

<script>
export default {
  props: ["connected"],
  data: function() {
    return {
      ip: "localhost",
      port: 10007,
    }
  },
  methods: {
    connect: function() {
      this.$emit("connect", this.ip, this.port);
    },
    disconnect: function() {
      this.$emit("disconnect");
    }
  }
}
</script>

<style scoped>
input {
  background: transparent;
  color: gray;
  border-bottom: 1px solid gray;
  height: inherit;
  padding: 0;
  margin-right: 4px;
}

input:focus {
  color: white;
  border-bottom: 1px solid white;
}
</style>
