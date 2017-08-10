<template>
    <div class="multiselect-dropdown-list" ref="dropdownList">
        <ul class="list-group mt-1" v-if="show" :style="width === null ? null : ('width:' + width + 'px')">
            <li class="list-group-item py-2 px-3" v-if="!options.length">{{ $parent._props.noResultsPlaceholder }}</li>
            <li class="list-group-item"
                ref="dropdownItem"
                :class="{'hover': hoverIndex === index, 'p-2': true}"
                v-for="(option, index) in options"
                @click="handleSelect(option, $event)"
                @mouseover="hoverIndex = index"
            >
                <span v-if="option.hasOwnProperty('image')" class="image mr-2">
                    <img :src="option[imageName]">
                </span>
                <span :class="{'pl-1': !option.hasOwnProperty('image')}"
                      v-html="searchQuery && searchQuery.length ? option[titleName].replace(new RegExp('(' + searchQuery + ')', 'gi'), '<span style=\'background: #fff2a8;\'>$1</span>') : option[titleName]"
                ></span>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    props: {
      show: {type: Boolean, default: false},
      titleName: {type: String},
      imageName: {type: String},
      keyName: {type: String},
      onSelect: {type: Function},
      onHide: {type: Function},
      options: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        hoverIndex: null
      }
    },
    computed: {
      width () {
        return this.$parent.$el.offsetWidth > 0 ? this.$parent.$el.offsetWidth : null
      },
      searchQuery () {
        return this.$parent.getChildrenByName('search')._data.query
      }
    },
    methods: {
      handleSelect (option, event) {
        event.stopPropagation()
        this.onSelect(option)
      },
      handlePressUp (event) {
        if (!this.hoverIndex) {
          this.hoverIndex = 0
        } else if (!this.options.length) {
          this.onHide()
        } else {
          this.hoverIndex--
        }

        if (this.$refs.dropdownItem[this.hoverIndex]) {
          if (this.$refs.dropdownItem[this.hoverIndex].offsetTop < this.$refs.dropdownList.scrollTop) {
            this.$refs.dropdownList.scrollTop = this.$refs.dropdownItem[this.hoverIndex].offsetTop
          }
        }
      },
      handlePressDown () {
        if (this.hoverIndex === null) {
          this.hoverIndex = 0
        } else if (this.hoverIndex + 1 >= this.options.length - 1) {
          this.hoverIndex = this.options.length - 1
        } else {
          this.hoverIndex++
        }

        if (this.$refs.dropdownItem[this.hoverIndex]) {
          let dropItemScollTop = this.$refs.dropdownItem[this.hoverIndex].offsetTop + this.$refs.dropdownItem[this.hoverIndex].offsetHeight
          if (dropItemScollTop - this.$refs.dropdownList.scrollTop > 250) {
            this.$refs.dropdownList.scrollTop += this.$refs.dropdownItem[this.hoverIndex].offsetHeight
          }
        }
      }
    },
    watch: {
      options (options) {
        if (this.hoverIndex > options.length - 1) {
          this.hoverIndex = options.length - 1
        }
      }
    },
    mounted () {
      let $vue = this
      document.addEventListener('click', function () {
        $vue.onHide()
      })
    }
  }
</script>

<style>
    .multiselect-dropdown-list {
        max-height: 250px;
        overflow: auto;
        z-index: 2000;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
        border-radius: 0.25rem;
        position: absolute;
    }

    li.list-group-item {
        cursor: pointer;
    }

    li.list-group-item img {
        max-width: 80px;
        max-height: 50px;
    }

    li .image {
        width: 80px;
        text-align: center;
    }

    li.hover {
        color: #464a4c !important;
        text-decoration: none !important;
        background-color: #f7f7f9 !important;
    }
</style>
