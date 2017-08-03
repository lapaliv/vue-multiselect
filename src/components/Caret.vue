<template>
    <div class="d-inline-flex py-2 px-3" @click="handleClickCaret"
         :class="{'align-self-center': optionsCount <= 1, 'align-self-end': optionsCount > 1}"
    >
        <i class="fa" :class="{'fa-caret-up': isShowDropdownList, 'fa-caret-down': !isShowDropdownList}"></i>
    </div>
</template>

<script>
  export default {
    props: {
      dropdownListCount: {type: Number, required: true},
      isShowDropdownList: {type: Boolean},
      onShowDropdownList: {type: Function},
      onHideDropdownList: {type: Function},
      optionsCount: {type: Number, required: true}
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      handleClickCaret (event) {
        let $vue = this
        let isShowDropDownList = $vue.isShowDropdownList
        setTimeout(function () {
          if (isShowDropDownList) {
            $vue.onHideDropdownList()
          } else {
            $vue.onShowDropdownList()
          }
        }, 10)
      }
    }
  }
</script>