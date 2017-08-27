const Multiselect = require('vue-loader!./Multiselect.vue')
require('font-awesome/css/font-awesome.min.css')

const install = function (Vue, options) {
  Vue.component('multiselect', Multiselect)
  Vue.prototype.$multiselectGlobalOptions = Object.assign({
    attachInput: false,
    isMulti: true,
    optionKeyName: 'id',
    optionTitleName: 'title',
    optionImageName: 'image',
    placeholder: 'Start typing...',
    noResultsText: 'No results',
    hasSearch: true,
    stubText: 'Select an item',
    hasHighlights: true
  }, options)
}

export default {install}
