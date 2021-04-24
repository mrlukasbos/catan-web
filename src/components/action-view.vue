<template>
  <div class="action-view">
    <div class="action-view__title">
      <h1 class="action-view__title-text">
        {{ T("YOUR_TURN") }}
      </h1>
    </div>
    <div class="action-view__resources">
      <h2 class="action-view__resources-title">
        {{ T("CURRENT_RESOURCES") }}
      </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium" />
    </div>
    <div class="action-view__buttons">
      <button class="action-view__trade-button">
        {{ T("TRADE") }}
      </button>
      <button class="action-view__development-button" @click="buyDevelopmentCard">
        {{ T("BUY_DEVELOPMENT") }}
      </button>
    </div>
    <div class="action-view__actions">
      <p v-if="actions.length == 0" class="action-view__actions-hint">
        {{ T("ACTIONS_HINT") }}
      </p>
      <div v-for="action in actions" :key="action.object" class="action-view__action" :class="action.action">
        <h4 class="action-view__action-name">
          {{ action.action }} <small v-if="settings.dev_mode">({{ action.object }}) </small>
        </h4>
        <resources-list :resources="action.resources" />
      </div>
    </div>
    <div class="action-view__finish">
      <button class="action-view__clear-button" @click="clearActions">
        {{ T("CLEAR_ACTIONS") }}
      </button>
      <button class="action-view__finish-button" @click="sendClientResponse">
        {{ T("FINISH_TURN") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ResourcesList from "./resources-list";
import Vue from 'vue'

import { Player } from '../type/player';
import { Settings } from '../type/settings';
import { Action } from "../type/action";

export default Vue.extend({
  components: {ResourcesList},
  props: {
    me: Player,
    actions: {
      type: Array(Action),
      default: () => []
    },
    settings: Settings,
  },
  methods: {
    buyDevelopmentCard: function () {
      this.$emit("createAction", "buyDevelopmentCard", null, [{type: "WOOL", value: -1},{type: "GRAIN", value: -1},{type: "ORE", value: -1}]);
    },
    clearActions: function() {
      this.$emit("clearActions");
    },
    sendClientResponse: function() {

      type BuildRequest = {
          structure: string,
          location?: string,
      }

      let buildRequest: BuildRequest[] = [];

      this.actions.forEach(action => {
        if (action.action === "placeBandit") {
          this.$emit("clientResponse", [{location: action.object.key}]);
          this.$emit("clearActions");
          return;
        } else if (action.action === "buildVillage") {
          buildRequest.push({ 
            structure: "village", 
            location: action.object.key 
          });
        } else if (action.action === "buildCity") {
          buildRequest.push({ 
            structure: "city", 
            location: action.object.key 
          });
        } else if (action.action === "buildRoad") {
          buildRequest.push({ 
            structure: "street", 
            location: action.object.key 
          });
        } else if (action.action === "buyDevelopmentCard") {
          buildRequest.push({ 
            structure: "development_card" });
        }
      });

      this.$emit("clientResponse", buildRequest);
      this.$emit("clearActions");
    }
  }
});
</script>
