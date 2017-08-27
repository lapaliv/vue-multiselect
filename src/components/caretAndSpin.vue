<template>
    <i v-if="!options.isLoading" class="mx-2 my-1 flex-column"
       :class="{
        'icon-angle-down': !isShowDropdownList,
        'icon-angle-up': isShowDropdownList,
        'align-self-center': $parent.countSelectedOptions <= 1,
        'align-self-end mb-2': $parent.countSelectedOptions > 1
       }"
       @click="$parent.handleClickByCaret"
    ></i>
    <i class="icon-spin1 animate-spin float-right d-flex flex-column mx-2 my-1"
       :class="{
        'align-self-center': $parent.countSelectedOptions <= 1,
        'align-self-end mb-2': $parent.countSelectedOptions > 1
       }"
       v-else></i>
</template>

<script>
  export default {
    computed: {
      options () {
        return this.$parent.options
      },
      isShowDropdownList () {
        return this.$parent.isShowDropdownList
      }
    }
  }
</script>