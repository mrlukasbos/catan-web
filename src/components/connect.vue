<template>
  <div>
    <input v-if="!connected" placeholder="Ip address" v-model="ip" v-on:keyup.enter="connect"/>
    <input v-if="!connected" placeholder="port" v-model="port" v-on:keyup.enter="connect"/>
    <a class="control" v-if="connected" v-on:click="disconnect"> {{T("DISCONNECT")}} </a>
    <a class="control" v-else v-on:click="connect"> {{T("CONNECT")}} </a>
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
