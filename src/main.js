import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import router from './router'

import "./assets/css/common.css"

Vue.use(ElementUI);
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router:router,
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线，$bus 就是当前应用的 vm
  }
}).$mount('#app')
