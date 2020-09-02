<template>
  <div id="app">
    <modal :visible="joinModalVisible">
      <h2> Join the game </h2>
      <input type="text" id="fname" placeholder="Your name" name="fname" v-model=player.name>
      <button v-on:click="hide_join_modal"> {{T("CANCEL")}} </button>
      <button v-on:click="join_game"> {{T("JOIN_GAME")}} </button>
    </modal>

    <modal :visible="leaveModalVisible">
      <h2> Leave the game </h2>
      <h3> Are you sure you want to leave the game, {{player.name}}? </h3>
      <button v-on:click="hide_leave_modal"> {{T("CANCEL")}} </button>
      <button v-on:click="leave_game"> {{T("LEAVE_GAME")}} </button>
    </modal>


      <div class="header">
        <span class="title"> Catan </span>
        <div class="controls">
            <div class="control">
                {{T(game_phase)}}
            </div>
            <div class="control">
                {{T(game_status)}}
            </div>
            <div class="control">
                {{T("DEV_MODE")}} <toggle-button v-model="dev_mode" :labels="{checked: t('ON'), unchecked: t('OFF')}" name="'debug'"/>
            </div>
            <div class="control">
            <select v-model="lang">
                <option v-for="locale in locales" :key="locale.id" :value="locale.id">{{locale.name}}</option>
            </select>
            </div>
            <a class="control" v-if="connected" v-on:click="start_game"> {{T("START_GAME")}} </a>
            <a class="control" v-if="connected" v-on:click="stop_game"> {{T("STOP_GAME")}} </a>
            <a class="control" v-if="connected" v-on:click="show_join_modal"> {{T("JOIN_GAME")}} </a>
            <a class="control" v-if="connected" v-on:click="show_leave_modal"> {{T("LEAVE_GAME")}} </a>
            <connect v-on:connect="connect" v-on:disconnect="kill_socket" :connected="connected" :key="lang"/>
        </div>
    </div>

    <board :board="board" :players="players" :lang="lang" :dev_mode="dev_mode" v-on:createAction="createAction"/>
    <players-view v-bind:class="{ 'players-view--visible': socket }" :players="players" :currentPlayerId="currentPlayerId" :dev_mode="dev_mode" :key="lang"/>
    
    <action-view v-bind:class="{ 'action-view--visible': ownTurn }" :me="me" :actions="actions" :key="lang" :dev_mode="dev_mode" v-on:clearActions="clearActions" v-on:createAction="createAction" v-on:clientResponse="sendClientResponse"/>
    
    <events-view :events="events" :players="players" :dev_mode="dev_mode" :key="lang"/>
  </div>
</template>

<script>
import connect from './components/connect.vue'
import board from './components/board.vue'
import playersView from './components/players-view.vue'
import eventsView from './components/events-view.vue'
import actionView from './components/action-view.vue'
import modal from './components/modal.vue'
import {setGlobalLanguage} from './translations'
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  name: 'App',
  components: {
    connect,
    board,
    ToggleButton,
    playersView,
    eventsView,
    actionView,
    modal,
  },

  data: function() {
    return {
      connected: false,
      socket: null,
      board: null,
      players: [],
      events: [],
      actions: [],
      lang: "EN",
      locales: [ {id: 'EN', name: 'English'}, {id: 'NL', name: 'Nederlands'}],
      dev_mode: true,
      joinModalVisible: false,
      leaveModalVisible: false,
      currentPlayerId: 1,
      recentResponse: null,
      game_status: "",
      game_phase: "",
      player: {
          id: -1,
          name: ""
      }
    }
  },

  // autoconnect on start
  mounted: function() {
    console.log("autoconnecting...")
    this.connect("localhost", 10007);
  },

  watch: {
    lang: function() {
        setGlobalLanguage(this.lang);
        this.$forceUpdate();
    }
  },

  computed: {
      // the player who is not
      currentPlayer: function() {
          let self = this;
          return this.players.find(function(player) {
            return player.attributes.id === self.currentPlayerId;
          })
      },
      me: function() {
          let self = this;
          return this.players.find(function(player) {
            return player.attributes.id === self.player.id;
          })
      },
      ownTurn: function() {
        return this.player.id == this.currentPlayerId;
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
          this.connected = true;

          if (localStorage.getItem("id") && localStorage.getItem("name")) {
            this.player.name = localStorage.getItem("name");
            this.player.id = localStorage.getItem("id");
            this.join_game();
          }
      }

      this.socket.onmessage = (data) => {
        var message = data.data.toString();
        let json = JSON.parse(message);

        if (json.model == "game") {
            this.board = json.attributes.board.attributes;
            this.players = json.attributes.players;
            this.currentPlayerId = json.attributes.currentPlayer;
            this.game_status = json.attributes.status;
            this.game_phase = json.attributes.phase;

            if (json.attributes.events) {
                this.events = json.attributes.events.reverse();
            }
        } else if (json.model == "response") {
            this.handleResponse(json.attributes);
        }
      }
    },
    sendClientResponse: function(response) {
        let msg = {
            model: "client-response",
            attributes: response
        }

        if (this.socket) {
          this.socket.send(JSON.stringify(msg));
        }
    },

    clearActions: function() {
        this.actions = [];
    },

    handleResponse: function(response) {
        if (response.code == 1) { // ID ACK
            this.player.id = parseInt(response.additional_info);
            localStorage.setItem("name", this.player.name);
            localStorage.setItem("id", this.player.id);
        } else if (response.code == 100) { // trade request

        } else if (response.code == 101) { // build request

        } else if (response.code == 102) { // initial build request
        
        } else if (response.code == 103) { // move bandit request
        
        } else if (response.code == 104) { // discard resources request
        
        }
    },

    kill_socket: function () {
      if (this.socket) {
        this.socket.close();
        delete this.$data.socket;
      }
      this.connected = false;
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
                id: this.player.id,
            }
        });
        console.log("sending this message to CATAN SERVER: " + joinMessage);
        this.socket.send(joinMessage);
        this.hide_join_modal();
    },
    leave_game() {
         let leaveMessage = JSON.stringify({
            model: "leave",
            attributes: {
                name: this.player.name,
                id: this.player.id,
            }
        });
        console.log("sending this message to CATAN SERVER: " + leaveMessage);
        this.socket.send(leaveMessage);
        this.hide_leave_modal();
    },
    show_leave_modal() {
        this.leaveModalVisible = true;
    },
    hide_leave_modal() {
        this.leaveModalVisible = false;
    },
    createAction: function (action, object, resources) {
      this.actions.push({action: action, object: object, resources: resources});
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
    align-items: center;
}

.control {
    border-left: 1px solid #444;
    padding-left: 12px;
    padding-right: 12px;
    font-weight: 600;
    font-size: small;
    cursor: pointer;
}

.control:hover {
    color: green;
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

code {
    background: #efefef;
    font-family: 'Courier New', Courier, monospace;
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
    stroke-width: 8px;
    pointer-events: visible;
    cursor: pointer;
    transition: opacity .3s, stroke-width .3s;
    stroke-linecap: round;
}

.border:hover {
    stroke-width: 12px;
}

.border--empty {
    opacity: 0;
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
    stroke-width: 3px;
    opacity: 0;
    transition: opacity .3s;
    transition: stroke-width .3s;
}

.node--empty:hover {
    opacity: .75;
    cursor: pointer;
}

.tile {
    opacity: 1;
    transition: opacity .3s;
}

.tile:hover {
    cursor: pointer;
    opacity: .5;
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

.node--village, .node--city  {
    cursor: pointer;
}

</style>
