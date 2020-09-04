<template>
  <div class="force-discard-view force-discard-view--visible">
    <div class="force-discard-view__title">
      <h1 class="force-discard-view__title-text"> {{T("YOUR_FORCE_DISCARD")}} </h1>
    </div>
    <div class="force-discard-view__resources">
      <h2 class="aforce-discard-view__resources-title"> {{T("CURRENT_RESOURCES")}} </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium"/>
    </div>
    <div class="force-discard-view__discards">
      <h2 class="aforce-discard-view__discards-title"> {{T("DISCARDS")}} </h2>
      <div v-for="resource in me.attributes.resources" :key="resource.id" class="force-discard-view__discards-field">
        <label :for=resource.type> {{T(resource.type)}} </label>
        <input :id=resource.type type="number" min="0" :max=resource.value placeholder="0" v-model="resourcesToDiscard[resource.type]" />
      </div>
      <p class="aforce-discard-view__discard-hint"> {{T("DISCARD_HINT")}} </p>
    </div>
    <div class="force-discard-view__finish" >
      <button class="force-discard-view__finish-button" v-on:click="sendClientResponse"> {{T("FINISH_DISCARD")}} </button>
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
        resourcesToDiscard: {}
      }
    },
    methods: {
      sendClientResponse: function() {
        let discardMessage = [];

        for (let item in this.resourcesToDiscard) {
          console.log(item);

          discardMessage.push({
            "type": item,
            "value": this.resourcesToDiscard[item]
          });
        }
        console.log(discardMessage);
        this.$emit("clientResponse", discardMessage);
        return true;
      }
    }
  };
</script>
