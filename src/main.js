import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import "./assets/css/common.css"
import '@/assets/font/font.css';
import store from './store';
import less from 'less';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(less);

Vue.prototype.reqUrl="http://"+window.IPConfig.baseIP+":8899";
Vue.prototype.reqBaseIp="http://"+window.IPConfig.baseIP;


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router:router,
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线，$bus 就是当前应用的 vm
  }
}).$mount('#app')
