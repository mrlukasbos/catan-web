import Vue from "vue";
import App from "./App.vue";
import {t, T} from "./translations";
import "./styles/app.scss";

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    t: str => t(str),
    T: str => T(str)
  }
});

new Vue({
  render: h => h(App),
}).$mount("#app");
