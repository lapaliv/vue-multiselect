<template>
    <div>
        <div :tabindex="disabled ? null : 0" :class="className" @keydown="handleKeyDown">
            <div v-if="showInput">
                <component is="selectedOptions"></component>
                <div class="d-flex flex-row" :class="{'mt-2': countSelectedOptions}">
                    <component is="searchOrStub" ref="input"></component>
                    <component is="caretAndSpin"></component>
                </div>
            </div>
            <div class="d-flex flex-row" v-else>
                <component is="searchOrStub" ref="input" v-if="showSearchOrStub"></component>
                <component is="selectedOptions" class="w-100"></component>
                <component is="caretAndSpin"></component>
            </div>
        </div>
        <div v-show="isShowDropdownList" ref="dropdownList" class="mt-1 dropdown-list" :style="{width: dropdownWidth}">
            <ul class="list-group">
                <li v-for="(option, index) in dropdownOptions"
                    @click="handleSelectDropdownOption($event, option)"
                    @mouseover="dropdownHoverIndex = index"
                    class="list-group-item py-1 px-3"
                    :class="{'bg-light': dropdownHoverIndex === index}"
                >
                    <img v-if="getOptionImage(option)" class="mr-2"
                         :src="getOptionImage(option)"
                         :alt="getOptionTitle(option)"
                    />
                    <span v-if="showDropdownHighlightTitle" v-html="getOptionHighlightTitle(option)"></span>
                    <span v-else>{{ getOptionTitle(option) }}</span>
                </li>
                <li v-if="showDropdownNoResults" class="list-group-item text-muted py-2 px-3">
                    {{ getProp('noResultsText') }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import selectedOptions from './components/selectedOptions.vue'
  import caretAndSpin from './components/caretAndSpin.vue'
  import searchOrStub from './components/searchOrStub.vue'
  import mixin from './mixins/MultiselectMixin'

  export default {
    components: {selectedOptions, caretAndSpin, searchOrStub},
    mixins: [mixin],
    name: 'vue-bootstrap-multiselect',
    props: {
      // Default options
      'default': {
        type: [Array, Object],
        'default': function () {
          return []
        }
      },
      // attach input type hidden for send forms
      attachInput: {
        type: Boolean,
        'default': null
      },
      name: {
        type: String,
        'default': null
      },
      isMulti: {
        type: Boolean,
        'default': null
      },
      optionKeyName: {
        type: String,
        'default': null
      },
      optionTitleName: {
        type: String,
        'default': null
      },
      optionImageName: {
        type: String,
        'default': null
      },
      asyncSearchCallback: {
        type: Function,
        'default': null
      },
      asyncSearchUrl: {
        type: String,
        'default': null
      },
      placeholder: {
        type: String,
        'default': null
      },
      noResultsText: {
        type: String,
        'default': null
      },
      value: {
        type: [String, Object, Array, null],
        'default': null
      },
      allValues: {
        type: Array,
        'default': null
      },
      hasSearch: {
        type: Boolean,
        'default': null
      },
      stubText: {
        type: String,
        'default': null
      },
      disabled: {
        type: Boolean,
        'default': false
      },
      hasHighlights: {
        type: Boolean,
        'default': null
      },
      id: {
        type: String,
        'default': null
      }
    },
    computed: {
      className () {
        return {
          'form-control multiselect py-1 pr-1': true,
          'disabled': this.disabled
        }
      },
      showSearchOrStub () {
        return !this.countSelectedOptions || this.getProp('hasSearch')
      },
      showDropdownNoResults () {
        return !Object.keys(this.dropdownOptions).length
      },
      showInput () {
        return this.getProp('hasSearch')
      },
      showDropdownHighlightTitle () {
        return this.query.length && this.getProp('hasHighlights')
      }
    }
  }
</script>

<style type="text/css">
    .list-group-item.individual-item {
        border-radius: .25rem;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }

    .list-group-item.individual-item + .list-group-item.individual-item {
        margin-top: 0.5rem;
    }

    .list-group-item img, .individual-item img {
        max-width: 100px;
        max-height: 50px;
    }

    .individual-item img {
        border-top-left-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }

    .multiselect input {
        outline: none;
        font-size: 1rem;
        line-height: 1.25;
        color: #495057;
        background-color: #fff;
        background-image: none;
        background-clip: padding-box;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        width: calc(100% - 25px);
    }

    .multiselect input::placeholder, .multiselect .stub {
        color: rgb(135, 142, 149);
    }

    .multiselect.disabled input {
        background-color: #e9ecef;
    }

    .multiselect [class^="icon-"]:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    .multiselect.disabled [class^="icon-"]:hover {
        opacity: 1;
        cursor: default;
    }

    .multiselect.disabled {
        opacity: 1;
        cursor: default !important;
        outline: none !important;
        border: 1px solid rgba(0, 0, 0, .15);
        background-color: #e9ecef;
    }

    .dropdown-list {
        z-index: 2000;
        max-height: 250px;
        overflow-y: auto;
        position: absolute;
        box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
        border-radius: .25rem;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }

    .list-group-item.bg-light {
        cursor: pointer;
    }
</style>