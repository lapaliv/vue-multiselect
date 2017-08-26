import Multiselect from './Multiselect.vue'
import './assets/fontello.css'

const install = function (Vue, options) {
  Vue.component('multiselect', Multiselect)
  Vue.prototype.$multiselectGlobalOptions = Object.assign({
    attachInput: false,
    isMulti: true,
    optionKeyName: 'id',
    optionTitleName: 'title',
    optionImageName: 'image',
    placeholder: 'Start typing...',
    noResultsText: 'No results'
  }, options)
}

export default {install}
