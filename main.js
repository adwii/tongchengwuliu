import Vue from 'vue'
import App from './App'
import {http} from 'http/apiRequest.js'
import login from 'components/login/login.vue'

Vue.config.productionTip = false
Vue.component('login',login)
Vue.prototype.http = http

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
