<template>
    <div class="d-flex" v-if="isShow">
        <div class="text-muted m-0 d-inline-flex form-control w-100 border-0 rounded stub"
             @click="handleClickByStub">{{ placeholder }}
        </div>
        <component is="caret"
                   :options-count="optionsCount"
                   :dropdown-list-count="dropdownListCount"
                   :is-show-dropdown-list="isShowDropdownList"
                   :on-show-dropdown-list="onShowDropdownList"
                   :on-hide-dropdown-list="onHideDropdownList"
        ></component>
    </div>
</template>

<script>
  import caret from './Caret.vue'

  export default {
    components: {caret},
    props: {
      placeholder: {type: String, default: 'Select option'},
      isShowDropdownList: {type: Boolean},
      onShowDropdownList: {type: Function},
      onHideDropdownList: {type: Function},
      dropdownListCount: {type: Number, required: true},
      isShow: {type: Boolean, required: true},
      optionsCount: {type: Number, required: true}
    },
    methods: {
      handleClickByStub (event) {
        event.stopPropagation()
        if (this.isShowDropdownList) {
          this.onHideDropdownList()
        } else {
          this.onShowDropdownList()
        }
      }
    }
  }
</script>

<style>
    .stub {
        cursor: default;
    }
</style>