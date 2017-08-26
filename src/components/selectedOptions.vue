<template>
    <ul class="list-group mb-1 mt-1 mr-2" v-if="Object.keys(options.selected).length">
        <li v-for="(option, key) in $parent.options.selected"
            class="list-group-item individual-item p-0 d-flex flex-row"
            :class="{
                'list-group-item-success': !disabled,
                'list-group-item-secondary': disabled
            }"
        >
            <img v-if="option instanceof Object && option.hasOwnProperty($parent.getValue('optionImageName'))"
                 :src="option[$parent.getValue('optionImageName')]"
                 :alt="option[$parent.getValue('optionTitleName')]"
                 @load="$parent.handleLoadOptionImage"
            />
            <div class="flex-column flex-wrap py-2 pl-3 align-self-center w-100">
                {{ option instanceof Object ? option[$parent.getValue('optionTitleName')] : option }}
            </div>
            <input type="hidden"
                   v-if="$parent.getValue('attachInput')"
                   :name="$parent.$props.name + ($parent.getValue('isMulti') ? '[]' : '')"
                   :value="option instanceof Object ? (option.hasOwnProperty($parent.getValue('optionKeyName'))
                            ? option[$parent.getValue('optionKeyName')]
                            : option[$parent.getValue('optionTitleName')])
                        : option"
            >
            <i class="icon-cancel float-right d-flex flex-column m-2 align-self-center"
               @click="$parent.handleClickByDeleteFromSelectedOptions($event, option)"></i>
        </li>
    </ul>
</template>

<script>
  export default {
    computed: {
      options () {
        return this.$parent.options
      },
      disabled () {
        return this.$parent.$props.disabled
      }
    },
    methods: {}
  }
</script>