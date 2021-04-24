import Vue from 'vue';
import App from './App.vue';
import { t, T } from './translations';
import './styles/app.scss';
Vue.config.productionTip = false;
Vue.mixin({
    methods: {
        t: function (str) { return t(str); },
        T: function (str) { return T(str); }
    }
});
new Vue({
    render: function (h) { return h(App); },
}).$mount('#app');
