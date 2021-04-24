<template>
  <div class="force-discard-view">
    <div class="force-discard-view__title">
      <h1 class="force-discard-view__title-text">
        {{ T("YOUR_TRADE") }}
      </h1>
    </div>
    <div class="force-discard-view__resources">
      <h2 class="force-discard-view__resources-title">
        {{ T("CURRENT_RESOURCES") }}
      </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium" />
    </div>
    <div class="trade-view__select">
      <h3 class="trade-view__result-title">
        {{ T("TRADE_OPTIONS") }}
      </h3>
      <trade-action v-for="option in tradeOptions" @addTrade="addTrade" :key="option.resource" :resource="option.resource" :ratio="option.ratio"/>
    </div>
    <div class="trade-view__actions">
      <h3 class="trade-view__result-title">
        {{ T("TRADE_ACTIONS") }}
      </h3>
      <trade-action v-for="action in tradeActions" :key="action.resource" :resource="action.from" :ratio="action.ratio" :target="action.to"/>
      <button v-if="tradeActions" class="trade-view__actions-clear-button" @click="clearActions">
        {{ T("CLEAR_TRADE") }}
      </button>
    </div>
    <div class="trade-view__result">
      <h3 class="trade-view__result-title">
        {{ T("TRADE_RESULT") }}
      </h3>
      <resources-list :resources="tradeResult" size="medium" />
    </div>
    <div class="force-discard-view__finish">
      <button class="force-discard-view__finish-button" @click="sendClientResponse">
        {{ T("FINISH_TRADE") }}
      </button>
    </div>
  </div>
</template>

<script>
import ResourcesList from "./resources-list";
import TradeAction from "./trade-action";

export default {
  components: {ResourcesList, TradeAction},
  props: ["me", "dev_mode"],
  data: function() {
    return {
      tradeActions: []
    }
  },
  computed: {
    tradeOptions: function () {
      let options = [];
      for (let i in this.tradeResult) {
        let resource = this.tradeResult[i];
        if (resource.value >= 4) {
          options.push({resource: resource.type, ratio: 4});
        }
      }
      return options;
    },
    tradeResult: function () {
      let result = JSON.parse(JSON.stringify(this.me.attributes.resources));
      for (let i in this.tradeActions) {
        let action = this.tradeActions[i];
        for (let j in result) {
          if (result[j].type == action.from) result[j].value -= action.ratio
          if (result[j].type == action.to) result[j].value += 1
        }
      }
      return result;
    }
  },
  methods: {
    sendClientResponse: function() {
      this.$emit("clientResponse", this.tradeActions);
    },
    addTrade: function(trade) {
      this.tradeActions.push(trade);
    },
    clearActions: function() {
      this.tradeActions = [];
    }
  }
};
</script>
