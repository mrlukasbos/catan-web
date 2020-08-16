<template>
  <div id="app">
    <h1> Catan </h1>
    <connect v-on:connect="connect"/>
  </div>
</template>

<script>
import connect from './components/connect.vue'

export default {
  name: 'App',
  components: {
    connect
  },
  data: function() {
    return {
      socket: null
    }
  },
  methods: {
    connect: function(ip, port) {
      this.kill_socket();
      this.socket = new WebSocket("ws://" + ip + ":" + port);
      
      this.socket.onerror = (err) => {
        alert("connection error " + err)
      }
      this.socket.onclose = () => {
          this.kill_socket();
      }
      this.socket.onopen = () => {   
      }
      this.socket.onmessage = (data) => {
        console.log(data);
      }
    },
    kill_socket: function () {
      if (this.socket) {
        this.socket.close();
        delete this.socket;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
    border: none;
    background-color: lightgreen;
    height:36px;
    border-radius: 4px;
    color: white;
    font-weight: 100;
    padding-right: 12px;
    padding-left: 12px;
    margin: 0;
}

button:hover {
    background-color: lawngreen;
    transition: background-color .12s;
}

input {
    border: none;
    background: #efefef;
    outline: none;
    background-color: none;
    padding-left: 20px;
    padding-bottom: 0px;
    padding-top: 0px;
    height: 36px;
    color: steelblue;
}

input:focus {
    transition: all .5s;
    color: black;
}


</style>
