import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuelidate from 'vuelidate'
import Toasted from 'vue-toasted'
// import io from 'socket.io-client'
import AppSocket from './plugins/socket'

import AppDropdown from './components/shared/AppDropdown'
import AppHero from './components/shared/AppHero'
import AppSpinner from './components/shared/AppSpinner'

import moment from 'moment'

Vue.config.productionTip = false

Vue.component('AppHero', AppHero)
Vue.component('AppDropdown', AppDropdown)
Vue.component('AppSpinner', AppSpinner)

Vue.use(vuelidate)
Vue.use(Toasted)
Vue.use(AppSocket, {connection: 'http://localhost:3001'})

Vue.filter('capitalize', function (value) {
  if (value && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return ''
})

Vue.filter('formatDate', function (value, formatType = 'LL') {
  if (!value) return ''

  return moment(value).format(formatType)
})

Vue.filter('fromNow', function (value) {
  if (!value) return ''

  return moment(value).fromNow()
})

new Vue({
  router,
  store,
  vuelidate,
  render: h => h(App),
}).$mount('#app')






