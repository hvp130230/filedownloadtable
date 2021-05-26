import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.directive('indeterminate', 
   function (el, binding) {
    el.indeterminate = Boolean(binding.value);
  }
)

new Vue({
  render: h => h(App),
}).$mount('#app')
