<template>
  <div class="force-discard-view">
    <div class="force-discard-view__title">
      <h1 class="force-discard-view__title-text"> {{T("YOUR_FORCE_DISCARD")}} </h1>
    </div>
    <div class="force-discard-view__resources">
      <h2 class="aforce-discard-view__resources-title"> {{T("CURRENT_RESOURCES")}} </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium"/>
    </div>

    <div class="force-discard-view__discards">
      <!-- <h2 class="force-discard-view__discards-title"> {{T("DISCARDS")}} </h2> -->
      <div v-for="resource in me.attributes.resources" :key="resource.id" class="force-discard-view__discards-field">
        <label :for=resource.type> {{T(resource.type)}} </label>

        <div class="force-discard-view__discards-field-counter">
          <button :disabled="resourcesToDiscard[resource.type] <= 0" v-on:click="decrement(resource.type)"> - </button>
          <input :id=resource.type type="number" min="0" :max=resourcesToDiscard[resource.type] v-model="resourcesToDiscard[resource.type]" />
          <button :disabled="resourcesToDiscard[resource.type] >= resource.value" v-on:click="increment(resource.type)"> + </button>
        </div>
      </div>
     <p class="force-discard-view__discard-hint"> You still have to discard <strong>{{amountToDiscard}}</strong> resources </p> 
    </div>
    <div class="force-discard-view__finish" >
      <button :disabled="amountToDiscard > 0" class="force-discard-view__finish-button" v-on:click="sendClientResponse"> {{T("FINISH_DISCARD")}} </button>
    </div>
  </div>
</template>

<script>
  import ResourcesList from "./resources-list";

  export default {
    components: {ResourcesList},
    props: ["me", "dev_mode"],
    data: function() {
      return {
        resourcesToDiscard: {
          "WOOL" : 0,
          "WOOD" : 0,
          "STONE" : 0,
          "GRAIN" : 0,
          "ORE" : 0,
        }
      }
    },
    computed: {
      amountToDiscard: function() {
        let amountToDiscard = 0;
        for (let item in this.resourcesToDiscard) {
          amountToDiscard += this.resourcesToDiscard[item];
        }

        let totalResources = 0;
        for (let item of this.me.attributes.resources) {
          totalResources += item.value;
        }

        return (Math.floor(totalResources/2)) - amountToDiscard;
      }
    },
    methods: {
      increment(type) {
        this.resourcesToDiscard[type]++;
      },
      decrement(type) {
        this.resourcesToDiscard[type]--;
      },
      sendClientResponse: function() {
        let discardMessage = [];
        for (let item in this.resourcesToDiscard) {
          discardMessage.push({
            "type": item,
            "value": this.resourcesToDiscard[item]
          });
        }
        this.$emit("clientResponse", discardMessage);
      }
    }
  };
</script>
