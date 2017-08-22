import Multiselect from './Multiselect.vue'
import './assets/fontello.css'

const install = function (Vue, options) {
  Vue.component('multiselect', Multiselect)
  Vue.prototype.$multiselectGlobalOptions = Object.assign({}, options)
}

export default {install}
