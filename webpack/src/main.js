import Vue from 'vue'
import routers from './routers'

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
