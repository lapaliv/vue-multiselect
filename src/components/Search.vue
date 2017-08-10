<template>
    <div class="d-flex" v-if="isShow">
        <input type="text"
               ref="input"
               tabindex="-1"
               v-model="query"
               class="m-0 d-inline-flex form-control w-100 border-0 rounded"
               :placeholder="placeholder"
               @focus="handleInputFocus"
               @click="handleInputFocus"
        />
        <div class="d-flex align-items-center text-center">
            <div v-if="isLoading" class="spinner"></div>
            <component is="caret"
                       v-if="!isLoading"
                       :options-count="optionsCount"
                       :dropdown-list-count="dropdownListCount"
                       :is-show-dropdown-list="isShowDropdownList"
                       :on-show-dropdown-list="onShowDropdownList"
                       :on-hide-dropdown-list="onHideDropdownList"
            ></component>
        </div>
    </div>
</template>

<script>
  import caret from './Caret.vue'

  export default {
    components: {caret},
    props: {
      placeholder: {type: String, default: 'Start typing...'},
      isShowDropdownList: {type: Boolean},
      onShowDropdownList: {type: Function},
      onHideDropdownList: {type: Function},
      onSearch: {type: Function, required: true},
      searchUrl: {type: String, default: null},
      dropdownListCount: {type: Number, required: true},
      isMulti: {type: Boolean},
      isShow: {type: Boolean, required: true},
      optionsCount: {type: Number, required: true}
    },
    data () {
      return {
        query: null,
        isLoading: false
      }
    },
    computed: {},
    methods: {
      handleInputFocus (event) {
        let $vue = this
        setTimeout(function () {
          if ($vue.query !== null && $vue.query.length) {
            $vue.onShowDropdownList()
          }
        }, 0.1)
      }
    },
    watch: {
      query (query) {
        let $vue = this
        setTimeout(() => {
          if ($vue.query === query) {
            this.onSearch(query === null ? null : (!query.length ? null : query))
          }
        }, 200)

        if (query === null || !query.length) {
          this.onHideDropdownList()
          this.isLoading = false
        } else {
          this.isLoading = true
        }
      },
      isShowDropdownList (isShow) {
        if (isShow && this.isLoading) {
          this.isLoading = false
        }
      }
    }
  }
</script>

<style>
    .spinner {
        min-height: 14px;
        padding: 23px 5px 10px 5px;
        justify-content: center;
        width: 40px;
    }

    .spinner:after,
    .spinner:before {
        position: absolute;
        content: "";
        margin: -15px 0 0 -7px;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        border: 2px solid transparent;
        border-top-color: #41b883;
        box-shadow: 0 0 0 1px transparent
    }

    .spinner:before {
        animation: a 2.4s cubic-bezier(.41, .26, .2, .62);
        animation-iteration-count: infinite
    }

    .spinner:after {
        animation: a 2.4s cubic-bezier(.51, .09, .21, .8);
        animation-iteration-count: infinite
    }

    @keyframes a {
        0% {
            transform: rotate(0);
        }
        to {
            transform: rotate(2turn);
        }
    }
</style>