<template>
  <div class="trade-action">
    <div class="trade-action__resource" :class="resource">
      {{ ratio }}
    </div>
    <span class="trade-action__arrow">➔</span>
    <div v-if="target" class="trade-action__target" :class="target">
      1
    </div>
    <button v-for="resource in otherResources" v-else :key="resource.id" class="trade-action__resource-button" :class="resource.type" @click="createTrade(resource)">
      1
    </button>
  </div>
</template>

<script>
export default {
  props: ['resource', 'ratio', 'target'],
  computed: {
    otherResources: function () {
      let resources = [
        {type: "GRAIN", value: 1},
        {type: "WOOL", value: 1},
        {type: "ORE", value: 1},
        {type: "STONE", value: 1},
        {type: "WOOD", value: 1}
      ];
      resources.splice(resources.findIndex((resource) => resource.type === this.resource), 1);
      return resources;
    }
  },
  methods: {
    createTrade: function (resource) {
      this.$emit("addTrade", {from: this.resource, ratio: this.ratio, to: resource.type});
    }
  }
}
</script>
