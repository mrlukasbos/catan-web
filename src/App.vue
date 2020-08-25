<template>
  <div id="app">

 <div class="modal" v-bind:class="{visible: joinModalVisible}" v-on:click.self="hide_join_modal">
        <div class="modal-body">
            <h2> Join the game </h2>
            <input type="text" id="fname" placeholder="Your name" name="fname" v-model=player.name>
            <button v-on:click="hide_join_modal"> Cancel </button>
            <button v-on:click="join_game"> Join </button>
        </div>
    </div>

      <div class="header">
        <span class="title"> Catan </span>
        <div class="controls">
            <div class="control">
                {{T("DEV_MODE")}} <toggle-button v-model="dev_mode" :labels="{checked: t('ON'), unchecked: t('OFF')}" name="'debug'"/>
            </div>
            <div class="control">
            <select v-model="lang">
                <option v-for="locale in locales" :key="locale.id" :value="locale.id">{{locale.name}}</option>
            </select>
            </div>
        </div>
    </div>
    <button v-on:click="start_game"> {{T("START_GAME")}} </button>
    <button v-on:click="stop_game"> {{T("STOP_GAME")}} </button>

    <button v-if="socket" v-on:click="show_join_modal"> {{T("JOIN_GAME")}} </button>
    <connect v-else v-on:connect="connect" :key="lang"/>

    <players-view v-bind:class="{ 'players-view--visible': socket }" :players="players" :currentPlayerId="currentPlayerId" :dev_mode="dev_mode" :key="lang"/>
    <action-view v-bind:class="{ 'action-view--visible': ownTurn }" :key="lang"/>
    <board :board="board" :players="players" :lang="lang" :dev_mode="dev_mode"/>
  </div>
</template>

<script>
import connect from './components/connect.vue'
import board from './components/board.vue'
import playersView from './components/players-view.vue'
import actionView from './components/action-view.vue'
import {setGlobalLanguage} from './translations'
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  name: 'App',
  components: {
    connect,
    board,
    ToggleButton,
    playersView,
    actionView,
  },

  data: function() {
    return {
      socket: null,
      board: null,
      players: [],
      lang: "EN",
      locales: [ {id: 'EN', name: 'English'}, {id: 'NL', name: 'Nederlands'}],
      dev_mode: false,
      joinModalVisible: false,
      currentPlayerId: 1,
      player: {
          name: ""
      }
    }
  },

  watch: {
    lang: function() {
        setGlobalLanguage(this.lang);
        this.$forceUpdate();
    }
  },

  computed: {
      currentPlayer: function() {
          let self = this;
          return this.players.find(function(player) {
              player.id == self.currentPlayerId;
          })
      },
      ownTurn: function() {
        return this.socket != null;
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

      this.socket.onopen = () => {}

      this.socket.onmessage = (data) => {
        var message = data.data.toString();
        let json = JSON.parse(message);
        this.board = json.attributes.board.attributes;
        this.players = json.attributes.players;
      //  this.currentPlayerId = json.attributes.currentPlayer;
      }
    },
    kill_socket: function () {
      if (this.socket) {
        this.socket.close();
        delete this.socket;
      }
    },
    start_game: function() {
      if (this.socket) {
          this.socket.send(JSON.stringify({
              model: 'control',
              attributes: {
                  command: 'START'
              }
          }));
      }
    },
    stop_game: function() {
        if (this.socket) {
             this.socket.send(JSON.stringify({
              model: 'control',
              attributes: {
                  command: 'STOP'
              }
          }));
        }
    },
    selectColor: function(evt, color) {
        this.player.color = color.code;
    },

    show_join_modal: function() {
        this.joinModalVisible = true;
    },
    hide_join_modal: function() {
        this.joinModalVisible = false;
    },
    join_game: function() {
        console.log("registering new player: " + this.player.name);
        console.log(this.player);

        let joinMessage = JSON.stringify({
            model: "join",
            attributes: {
                name: this.player.name,
            }
        });
        console.log("sending this message to CATAN SERVER: " + joinMessage);
        this.socket.send(joinMessage);
        this.hide_join_modal();
    }
  }
}
</script>

<style>

* {
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
}

html, body {
    margin: 0;
    background-color: #222;
  overflow-x: hidden;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 4px;
    color: white;
    border-bottom: 1px solid #444;
    background-color: #000;
}

.title {
    font-weight: bold;
}

.controls {
    display: flex;
}

.control {
border-left: 1px solid #444;
padding-left: 12px;
padding-right: 12px;
}

#debug-checkbox {
    height: auto;
}

button {
    border: none;
    background-color:  rgba(46, 167, 6, 1);
    height:36px;
    border-radius: 0px;
    color: white;
    font-weight: 100;
    padding-right: 12px;
    padding-left: 12px;
    margin: 0;
}

button:hover {
    background-color:  rgb(41, 148, 5);
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



.resource {
    border: .5px solid gainsboro;
}

.info {
    background-color: aliceblue;
    height: 100vh;
    color: black;
    width: 20%;
    min-width: 300px;
}

.board {
    display: block;
}

.hexagon {
    fill: white;
    pointer-events: all;
}

.hexagon .DESERT {
    fill: sandybrown;
}

.WOOL {
    fill: lawngreen;
    background-color: lawngreen;
    color: black;
}

.WOOD {
    fill: forestgreen;
    background-color: forestgreen;
    color: white;
}

.STONE {
    fill: rosybrown;
    background-color: rosybrown;
    color: white;
}

.GRAIN {
    fill: khaki;
    background-color: khaki;
    color: black;
}

.ORE {
    fill: lightgray;
    background-color: lightgray;
    color: black;
}

.hexagon .SEA {
    fill: lightskyblue;
}

.hexagon .HARBOUR_WOOL,
.hexagon .HARBOUR_WOOD,
.hexagon .HARBOUR_STONE,
.hexagon .HARBOUR_GRAIN,
.hexagon .HARBOUR_ORE,
.hexagon .HARBOUR_ALL {
    fill: lightskyblue;
}

.mesh {
    fill: none;
    pointer-events: none;
    display: none;
}

.border {
    stroke-width: 7px;
    pointer-events: visible;
    cursor: pointer;
    transition: opacity .3s, stroke-width .3s;
    stroke-linecap: round;
}

.border:hover {
    stroke-width: 12px;
}

.border--empty {
    opacity: .5;
}

.border--empty:hover {
    opacity: .75;
}

.harbour-edge {
    opacity: .6;
    stroke-width: 16px;
    stroke-linecap: round;
}

.numbers {
    font-size: 25px;
    pointer-events: none;
}

.labels {
    font-size: 12px;
    pointer-events: none;
}

.types {
    font-size: 16px;
    pointer-events: none;
}

.events {
    font-weight: 100;
    overflow-y: scroll;
    font-size: .8rem;
}

.resource-txt {
    padding: 4px;
    border-radius: 2px;
    font-weight: 600;
    margin-right: 4px;
    font-size: .7rem;
}

.node {
    stroke: #000;
    pointer-events: all;
}

.node--empty {
    fill: #fff;
    stroke: #fff;
    opacity: .4;
    transition: opacity .3s;
    transition: stroke-width .3s;
}

.node--empty:hover {
    opacity: .75;
    cursor: pointer;
    stroke-width: 5px;
}

.tile {
    opacity: 1;
    transition: opacity .3s;
}

.tile:hover {
    cursor: pointer;
    opacity: .5;
}

.modal {
    width: 100vw;
    height: 100vw;
    background-color: rgba(200, 200, 200, 0.5);
    position:fixed;
    visibility: hidden;
    transition: visibility .3s, opacity .3s;
    opacity: 0;
    z-index: 999;
}

.modal.visible {
    visibility: visible;
    opacity: 1;
}

.modal-body {
    margin-top: 20%;
    padding: 30px;
    padding-left: 330px;
    background-color: white;
}

.fancy-input {
    border-bottom: 3px solid steelblue;
    outline: none;
    background-color: none;
    font-size: x-large;
    padding-left: 20px;
    padding-bottom: 30px;
    padding-top: 30px;
    color: steelblue;
}

.fancy-input:focus {
    border-bottom: 3px solid blueviolet;
    transition: all .5s;
    color: blueviolet;
}

.color-squares {
    display: inline-flex;
}

.color-square {
    width: 40px;
    height: 40px;
    border: 4px solid #efefef;
    border-radius: 2px;
    margin: 4px;
    transition: border .5s;
}


</style>
