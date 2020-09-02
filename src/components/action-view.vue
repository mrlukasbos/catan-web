<template>
  <div class="action-view">
    <div class="action-view__title">
      <h1 class="action-view__title-text"> {{T("YOUR_TURN")}} </h1>
    </div>
    <div class="action-view__resources">
      <h2 class="action-view__resources-title"> {{T("CURRENT_RESOURCES")}} </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium"/>
    </div>
    <div class="action-view__buttons">
      <button class="action-view__trade-button"> {{T("TRADE")}} </button>
      <button class="action-view__development-button" v-on:click="buyDevelopmentCard"> {{T("BUY_DEVELOPMENT")}} </button>
    </div>
    <div class="action-view__actions">
      <p class="action-view__actions-hint" v-if="actions.length == 0"> {{T("ACTIONS_HINT")}} </p>
      <div v-for="action in actions" v-bind:key="action.object" class="action-view__action" v-bind:class="action.action">
        <h4 class="action-view__action-name"> {{action.action}} <small v-if="dev_mode">({{action.object}}) </small></h4>
        <resources-list :resources="action.resources"/>
      </div>
    </div>
    <div class="action-view__finish" >
      <button class="action-view__clear-button" v-on:click="clearActions"> {{T("CLEAR_ACTIONS")}} </button>
      <button class="action-view__finish-button" v-on:click="sendClientResponse"> {{T("FINISH_TURN")}} </button>
    </div>
  </div>
</template>

<script>
  import ResourcesList from "./resources-list";

  export default {
    components: {ResourcesList},
    props: ["me", "actions", "dev_mode"],
    methods: {
      buyDevelopmentCard: function () {
        this.$emit("createAction", "buyDevelopmentCard", null, [{type: "WOOL", value: -1},{type: "GRAIN", value: -1},{type: "ORE", value: -1}]);
      },
      clearActions: function() {
        this.$emit("clearActions");
      },
      sendClientResponse: function() {
        let buildRequest = [];
        let self = this;

        this.actions.forEach(function(action) {
          if (action.action === "placeBandit") {
            self.$emit("clientResponse", [{location: action.object.key}]);
            self.$emit("clearActions");
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
}
</script>

<style scoped>
  .action-view {
    background: #333;
    position: absolute;
    width: 400px;
    height: 90vh;
    color: white;
    border-radius: 4px;
    right: -400px;
    top: 64px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: right 300ms;
  }

  .action-view--visible {
    right: 24px;
  }

  .action-view > * {
    padding: 4px 0;
  }

  .action-view__title {
    border-bottom: solid 1px #444;
  }

  .action-view__title-text {
    margin: 0;
  }

  .action-view__resources-title {
    margin: 0 0 4px 0;
  }

  .action-view__buttons {
    display: flex;
    width: 100%;
  }

  .action-view__trade-button,
  .action-view__development-button {
    flex-grow: 1;
  }

  .action-view__trade-button {
    margin-right: 1px;
  }

  .action-view__actions {
    flex-grow: 1;
  }

  .action-view__action {
    display: flex;
    align-items: center;
    padding: 4px 0;
  }

  .action-view__action:not(:last-child) {
    border-bottom: solid 1px #444;
  }

  .action-view__action-name {
    margin: 0;
    flex-grow: 1;
  }

  .action-view__finish-button {
    width: 100%;
    font-size: large;
    font-weight: bold;
  }
  .action-view__clear-button {
    width: 100%;
    font-size: large;
    font-weight: bold;
  }
</style>
