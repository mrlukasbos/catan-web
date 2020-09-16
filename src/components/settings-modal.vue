<template>
  <div class="modal" @click.self="close">
    <div class="modal__body">
      <div class="settings-modal-content">
        <h1> {{ T("SETTINGS") }} </h1>
        <div class="modal-row">
          {{ T("DEV_MODE") }} <toggle-button v-model="newSettings.dev_mode" :labels="{checked: t('ON'), unchecked: t('OFF')}" name="'debug'" />
        </div>
        <div class="modal-row">
          {{ T("LANGUAGE") }}
          <select v-model="newSettings.lang">
            <option v-for="locale in locales" :key="'locale-'+locale.id" :value="locale.id">
              {{ locale.name }}
            </option>
          </select>
        </div>

        <div class="modal-row">
          <button class="button secondary" @click="close">
            {{ T("CANCEL") }}
          </button>
          <button class="button" @click="apply">
            {{ T("APPLY") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
      
    
<script>
import { ToggleButton } from 'vue-js-toggle-button'
import modal from './modal.vue'
import _ from 'lodash'

export default {
  components: {
    ToggleButton,
  },
  extends: modal,
  props: ['settings'],
  data: function() {
    return {
      newSettings: null,
      locales: [ {id: 'EN', name: 'English'}, {id: 'NL', name: 'Nederlands'}],
    }
  },
  beforeMount: function() {
    if (this.settings) {
      this.newSettings = _.cloneDeep(this.settings);
    }
  },
  methods: {
    apply() {
      this.$emit("settingsChanged", this.newSettings);
      this.close();
    },
    close() {
      this.$emit("close")
    }
  }
}
</script>
