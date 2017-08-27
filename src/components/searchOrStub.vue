<template>
    <input type="text" class="d-inline-block py-1 flex-column border-0"
           :placeholder="$parent.getProp('placeholder')"
           v-model="$parent.query"
           tabindex="-1"
           ref="input"
           :disabled="disabled"
           @focus="$parent.handleFocusInput"
           v-if="$parent.getProp('isSearch')"
    >
    <div class="d-inline-block py-1 flex-column w-100 stub" @click="$parent.handleClickByCaret" v-else>
        {{ $parent.getProp('stubText') }}
    </div>
</template>

<script>
  export default {
    computed: {
      disabled () {
        return this.$parent.$props.disabled
      }
    }
  }
</script>