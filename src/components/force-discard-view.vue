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
        <input :id=resource.type type="number" min="0" :max=resource.value value="0" v-on:change="addResource($event, resource.type)" />
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
    methods: {
      addResource: function(event, type) {
        console.log({type: type, value: event.target.value});
      },
      sendClientResponse: function() {
        return true;
      }
    }
  };
</script>
