<template>
  <div id="app">
    <modal v-show="joinModalVisible" v-on:close="joinModalVisible = false">
        <h2> Join the game </h2>
        <input type="text" id="fname" placeholder="Your name" name="fname" v-model=player.name>
        <div class="modal-row">
            <button class="button secondary" v-on:click="joinModalVisible = false"> {{T("CANCEL")}} </button>
            <button class="button primary"  v-on:click="join_game"> {{T("JOIN_GAME")}} </button>
        </div>
    </modal>

    <modal v-show="leaveModalVisible" v-on:close="leaveModalVisible = false">
      <h2> Leave the game </h2>
      <h3> Are you sure you want to leave the game, {{player.name}}? </h3>
      <div class="modal-row">
        <button class="button secondary" v-on:click="leaveModalVisible = false"> {{T("CANCEL")}} </button>
        <button class="button primary" v-on:click="leave_game"> {{T("LEAVE_GAME")}} </button>
      </div>
    </modal>

    <settings-modal v-if="settingsModalVisible" v-on:close="settingsModalVisible = false" v-on:settingsChanged="applySettings" :settings="settings"/>

    <div class="header">
        <span class="title"> Catan </span>
        <div class="controls">
            <div class="control">
                {{T(game_phase)}}
            </div>
            <div class="control">
                {{T(game_status)}}
            </div>
                <div v-on:click="settingsModalVisible = true" class="control clickable">
                {{T("SETTINGS")}}
            </div>    
            <a class="control clickable" v-if="connected && !gameIsRunning" v-on:click="start_game"> {{T("START_GAME")}} </a>
            <a class="control clickable" v-if="connected && gameIsRunning" v-on:click="stop_game"> {{T("STOP_GAME")}} </a>
            <a class="control clickable" v-if="!joined" v-on:click="joinModalVisible = true"> {{T("JOIN_GAME")}} </a>
            <a class="control clickable" v-if="joined" v-on:click="leaveModalVisible = true"> {{T("LEAVE_GAME")}} </a>
            <connect v-on:connect="connect" v-on:disconnect="kill_socket" :connected="connected"/>
        </div>
    </div>

    <board :board="board" :players="players" :settings="settings" v-on:createAction="createAction" v-on:removeAction="removeAction" :actions="actions"/>
    <players-view v-bind:class="{ 'players-view--visible': socket }" :players="players" :currentPlayerId="currentPlayerId" :settings="settings"/>
    
    <action-view v-bind:class="{ 'action-view--visible': true }" :me="me" :actions="actions" :settings="settings" v-on:clearActions="clearActions" v-on:createAction="createAction" v-on:clientResponse="sendClientResponse"/>
    
    <events-view :events="events" :players="players"/>
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
import settingsModal from './components/settings-modal.vue'

export default {
  name: 'App',
  components: {
    connect,
    board,
    playersView,
    eventsView,
    actionView,
    modal,
    settingsModal,
  },

  data: function() {
    return {
        settings: {
            lang: "EN",
            dev_mode: true,
        },
        connected: false,
        socket: null,
        board: null,
        players: [],
        events: [],
        actions: [],
        joinModalVisible: false,
        leaveModalVisible: false,
        settingsModalVisible: false,
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

  computed: {
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
      }, 
      gameIsRunning: function() {
          return this.game_status == "GAME_RUNNING";
      },
      joined: function() {
        let self = this;
        return this.players.some(function(player) {
            return player.attributes.id == self.player.id;
        })
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
    applySettings(newSettings) {
        this.settings = newSettings;
        setGlobalLanguage(this.settings.lang);
        this.$forceUpdate();
    },
    selectColor: function(evt, color) {
        this.player.color = color.code;
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
        this.joinModalVisible = false;
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
        this.leaveModalVisible = false;
    },
    createAction: function (action, object, resources) {
      this.actions.push({action: action, object: object, resources: resources});
    },
    removeAction: function(action) {
        const index = this.actions.indexOf(action);
        if (index > -1) {
            this.actions.splice(index, 1);
        }
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
}

.clickable {
    cursor: pointer;
}
.clickable:hover {
    color: green;
}

#debug-checkbox {
    height: auto;
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
