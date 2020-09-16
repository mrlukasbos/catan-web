<template>
  <div class="force-discard-view">
    <div class="force-discard-view__title">
      <h1 class="force-discard-view__title-text">
        {{ T("YOUR_TRADE") }}
      </h1>
    </div>
    <div class="force-discard-view__resources">
      <h2 class="aforce-discard-view__resources-title">
        {{ T("CURRENT_RESOURCES") }}
      </h2>
      <resources-list v-if="me" :resources="me.attributes.resources" size="medium" />
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

export default {
  components: {ResourcesList},
  props: ["me", "dev_mode"],
  data: function() {
    return {
    }
  },
  computed: {
  },
  methods: {
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
