import Vue from 'vue'
import routers from './routers'
import DemoBlock from './components/DemoBlock.vue'
import Alert from './packages/alert.vue'

Vue.component('demo-block', DemoBlock)
Vue.component('sf-alert', Alert)


new Vue({
  el: '#app',
  data : {
    currentRoute: window.location.pathname
  },
  computed
  : {
    ViewComponent () {
      const matchingView = routers[this.currentRoute]
      return matchingView
        ? require('./pages/' + matchingView + '.vue')
        : require('./pages/404.vue')
    }
  },

  render(h) {
    return h(this.ViewComponent)
  }

})
