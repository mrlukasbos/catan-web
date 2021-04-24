<template>
  <transition name="fade">
    <div v-show="events.length" class="events">
      <div v-for="event in formattedEvents" :key="event.id" class="event">
        <span v-if="event.attributes.player_full" :style="{ 'color': event.attributes.player_full.attributes.color }">
          {{ event.attributes.player_full.attributes.name }}
        </span>

        <span v-if="event.attributes.event_type=='GENERAL'">
          {{ event.attributes.message }}
        </span>

        <span v-if="event.attributes.event_type == 'BUILD'">
          <span v-if="event.attributes.structures.length">
            builds
            <span v-for="structure in event.attributes.structures" :key="structure.id"> {{ structure }} </span>
          </span>
          <span v-else>
            builds nothing
          </span>
        </span>
        <span v-else-if="event.attributes.event_type == 'GET_RESOURCES'">
          <span v-if="event.attributes.resources.length">
            receives
            <span v-for="resource in event.attributes.resources" :key="resource.id">
              <span class="resource-txt" :class="resource.type"> {{ resource.value }} {{ resource.type }} </span>

            </span>
          </span>
          <span v-else>
            receives nothing
          </span>
        </span>

        <span v-else-if="event.attributes.event_type == 'TRADE'">
          <span v-if="event.attributes.resources.length">
            trades
            <span v-for="resource in event.attributes.resources" :key="resource.id">
              <span class="resource-txt" :class="resource.type"> {{ resource.value }} {{ resource.type }} </span>

            </span>
          </span>
          <span v-else>
            receives nothing
          </span>
        </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({
  props: ['players', 'events'],
  computed: {
    formattedEvents: function () {
      return this.events.map(evt => {
        const player_id = evt.attributes.player;
        const complete_player = self.players.filter(player => {
          return player.attributes.id == player_id;
        })[0];
        evt.attributes.player_full = complete_player;
        return evt;
      });
    }
  }
})
</script>

<style scoped>
  .events {
    background: #333;
    position: absolute;
    width: 400px;
    color: white;
    border-radius: 4px;
    left: 24px;
    bottom: 24px;
    height: 240px;
    overflow-y: scroll;
    padding-top: 24px;
  }

  .event {
    font-size: 1.1rem;
    padding: 12px;
    padding-left: 24px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>