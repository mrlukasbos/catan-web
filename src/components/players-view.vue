<template>
  <div class="players">
    <div v-if="players.length">
      <div v-for="player in players" v-bind:key="player.attributes.id" :style="playerStyle(player)" class="player-card">
        <span :style="{ 'color': player.attributes.color }"> {{player.attributes.name}} <small v-if="dev_mode">({{player.attributes.id}}) </small></span>

        <small> {{T ("RESOURCES")}} </small>
        <div v-for="resource in player.attributes.resources" :key="resource.id">
          <div v-if="resource.value!=0">
            <div
              style="font-weight: 100; width: 18px; height: 28px; border-radius: 5%; margin-right: 4px; display: flex; align-items: center; justify-content: center;"
              class="resource" v-bind:class="resource.type"> {{resource.value}}
            </div>
          </div>
        </div>

        <small>{{T ("DEVELOPMENT_CARDS")}} ({{player.attributes.unused_development_cards}} {{t("UNUSED")}})</small>
        <div style="width: 100%; display: flex;">
          <div v-for="developmentcard in player.attributes.used_development_cards" :key="developmentcard.id">
            <div v-if="developmentcard.value!=0">
              <div
                style="font-weight: 100; width: 18px; height: 28px; border-radius: 5%; margin-right: 4px; display: flex; align-items: center; justify-content: center;"
                class="developmentcard" v-bind:class="developmentcard.type">
                {{developmentcard.value}}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <div v-else class="no-connections">
      <strong> {{T("NO_PLAYERS_CONNECTED")}} </strong>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['players', 'currentPlayerId', 'dev_mode'],
    data: function () {
      return {
        ip: "localhost",
        port: 10007,
      }
    },
    methods: {
      playerStyle: function(player) {
        return {backgroundColor: (player.attributes.id == this.currentPlayerId) ? "black" : "transparent"};
      }
    }
  }
</script>

<style scoped>
  .players {
    background: #333;
    position: absolute;
    width: 400px;
    color: white;
    border-radius: 4px;
    left: 24px;
    top: 96px;
  }

  .player-card {
    padding: 12px;
    border-radius: 4px;
    margin: 12px;
  }

  .no-connections { 
    margin: 24px;
  }
</style>