// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Multiselect from './Multiselect.vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<div><Multiselect :short-tags="true" :is-multi="true" :all-values=\'["Первый", "Второй", "Третий", "Четвертый", "Пятый", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]\' :async-search-callback="cb"></Multiselect><Multiselect style="margin-top: 200px;" :short-tags="true" :is-multi="true" :all-values=\'["Первый", "Второй", "Третий", "Четвертый", "Пятый", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]\' :async-search-callback="cb"></Multiselect><Multiselect :short-tags="true" :is-multi="true" :all-values=\'["Первый", "Второй", "Третий", "Четвертый", "Пятый", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]\' :async-search-callback="cb"></Multiselect></div>',
  components: {Multiselect},
  methods: {
    cb (query) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve({data: [1, 2, 3, 4, {
            image: 'http://mosreg.ru/upload/gallery/496/98496_450d931ef8e00ed83f8f84c5e39add61b1d566ef_thumb.jpg',
            title: 'mosreg.ru'
          }]})
        }, 2000)
      })
    }
  }
})
