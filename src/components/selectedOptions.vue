<template>
    <ul class="list-group mb-1 mt-1 mr-2" v-if="$parent.countSelectedOptions">
        <li v-for="(option, key) in $parent.options.selected"
            class="list-group-item individual-item p-0 d-flex flex-row"
            :class="{
                'list-group-item-success': !disabled,
                'list-group-item-secondary': disabled
            }"
        >
            <img v-if="$parent.getOptionImage(option)"
                 :src="$parent.getOptionImage(option)"
                 :alt="$parent.getOptionTitle(option)"
                 @load="$parent.handleLoadOptionImage"
            />
            <div class="flex-column flex-wrap py-2 pl-3 align-self-center w-100">{{ $parent.getOptionTitle(option) }}</div>
            <input type="hidden"
                   v-if="$parent.getProp('attachInput')"
                   :name="$parent.$props.name + ($parent.getProp('isMulti') ? '[]' : '')"
                   :value="$parent.getOptionKey(option)"
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
    }
  }
</script>