<template>
    <div>
        <div tabindex="0" class="form-control multiselect py-1 pr-1" @keydown="handleKeyDown"
             :class="{'disabled': disabled}"
        >
            <div v-if="showInput">
                <component is="selectedOptions"></component>
                <div class="d-flex flex-row" :class="{'mt-2': Object.keys(options.selected).length}">
                    <component is="searchOrStub" ref="input"></component>
                    <component is="caretAndSpin"></component>
                </div>
            </div>
            <div class="d-flex flex-row" v-else>
                <component is="searchOrStub" ref="input"
                           v-if="isMulti || !Object.keys(options.selected).length"></component>
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
                    <img v-if="option instanceof Object && option.hasOwnProperty(getValue('optionImageName'))"
                         class="mr-2"
                         :src="option[getValue('optionImageName')]"
                         :alt="option[getValue('optionTitleName')]"
                    />
                    {{ option instanceof Object ? option[getValue('optionTitleName')] : option }}
                </li>
                <li v-if="!Object.keys(dropdownOptions).length" class="list-group-item text-muted py-2 px-3">
                    {{ getValue('noResultsText') }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import selectedOptions from './components/selectedOptions.vue'
  import caretAndSpin from './components/caretAndSpin.vue'
  import searchOrStub from './components/searchOrStub.vue'

  export default {
    components: {selectedOptions, caretAndSpin, searchOrStub},
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
      isSearch: {
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
      }
    },
    data () {
      return {
        isShowDropdownList: false,
        query: '',
        options: {
          selected: [],
          search: [],
          searchMode: false,
          isLoading: false,
          'default': []
        },
        dropdownHoverIndex: -1,
        dropdownDefaultTop: null,
        dropdownTop: null,
        dropdownBoxShadow: null,
        dropdownWidth: '100%'
      }
    },
    computed: {
      dropdownOptions () {
        let results = {}
        let options = this.options.searchMode ? this.options.search : this.options.default

        for (let key in options) {
          let title = options[key] instanceof Object
            ? options[key][this.getValue('optionTitleName')]
            : options[key]

          let queryIsEmpty = !this.query.length
          let titleIsFind = title.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
          let optionHasNotInSelected = this.options.selected.indexOf(options[key]) === -1

          if ((queryIsEmpty || titleIsFind) && optionHasNotInSelected) {
            let searchInSelected = false
            for (let index in this.options.selected) {
              let selectedTitle = this.options.selected[index] instanceof Object
                ? this.options.selected[index][this.getValue('optionTitleName')]
                : this.options.selected[index]
              if (selectedTitle.toLowerCase() === title.toLowerCase()) {
                searchInSelected = true
                break
              }
            }
            if (!searchInSelected) {
              results[key] = options[key]
            }
          }
        }

        return results
      },
      showInput () {
        return this.getValue('isSearch') && (!Object.keys(this.options.selected).length || this.getValue('isMulti'))
      }
    },
    methods: {
      showDropdownList () {
        if (!this.disabled) {
          this.isShowDropdownList = true
        }
      },
      hideDropdownList () {
        this.isShowDropdownList = false
      },
      handleClickByCaret (event) {
        if (!this.disabled) {
          if (!this.isShowDropdownList) {
            let $vue = this
            setTimeout(function () {
              $vue.showDropdownList()
            }, 100)
          } else {
            this.hideDropdownList()
          }
        }
      },
      setOptions (type, data) {
        let options = Object.assign({}, this.options)
        options[type] = Object.assign([], data)
        this.options = options
      },
      handleSelectDropdownOption (event, option) {
        if (!this.disabled) {
          let selectedOptions = Object.assign([], this.options.selected)
          if (this.getValue('isMulti')) {
            selectedOptions.push(option)
          } else {
            selectedOptions = [option]
          }
          this.setOptions('selected', selectedOptions)
          if (Object.keys(this.dropdownOptions).length && this.getValue('isMulti')) {
            event.stopPropagation()
          }
        }
      },
      handleClickByDeleteFromSelectedOptions ($event, option) {
        if (!this.disabled) {
          let results = []
          for (let index = 0; index < this.options.selected.length; index++) {
            if (this.options.selected[index] !== option) {
              results.push(this.options.selected[index])
            }
          }
          this.setOptions('selected', results)
        }
      },
      handleKeyDown (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (this.isShowDropdownList) {
            let search = false
            for (let key in this.dropdownOptions) {
              if (!search && this.dropdownHoverIndex <= 0) {
                this.dropdownHoverIndex = key
                break
              } else if (!search && this.dropdownHoverIndex === key) {
                search = true
              } else if (search) {
                this.dropdownHoverIndex = key
                break
              }
            }
          } else {
            this.showDropdownList()
          }
        } else if (event.key === 'ArrowUp') {
          if (this.isShowDropdownList) {
            event.preventDefault()
            let oldIndex = -1
            for (let key in this.dropdownOptions) {
              if (this.dropdownHoverIndex === key) {
                this.dropdownHoverIndex = oldIndex
                break
              }
              oldIndex = key
            }
            this.dropdownHoverIndex === -1 ? this.hideDropdownList() : null
          }
        } else if (event.key === 'Enter' && this.isShowDropdownList && Object.keys(this.dropdownOptions).length) {
          this.handleSelectDropdownOption(event, this.dropdownOptions[this.dropdownHoverIndex])
          if (!this.getValue('isMulti')) {
            this.hideDropdownList()
          }
          this.dropdownHoverIndex = 0
        } else if (event.key !== 'Tab' && this.$refs.input && this.$refs.input.$refs.input) {
          this.$refs.input.$refs.input.focus()
        } else if (event.key === 'Tab') {
          this.hideDropdownList()
        }
      },
      handleFocusInput (event) {
        let $vue = this
        setTimeout(function () {
          $vue.showDropdownList()
          $vue.$el.focus()
        }, 150)
      },
      asyncSearch (query) {
        let promise = null
        if (this.asyncSearchCallback) {
          promise = this.asyncSearchCallback(query)
        } else if (this.asyncSearchUrl) {
          promise = axios.get(this.asyncSearchUrl + (this.asyncSearchUrl.indexOf('?') === -1 ? '?' : '&') + 'query=' + query)
        }

        if (promise) {
          this.options.isLoading = true
          let options = Object.assign({}, this.options)
          promise.then((res) => {
            options.search = res.data
            options.searchMode = true
            options.isLoading = false
            this.options = options
            this.showDropdownList()
          }).catch((res) => {
            options.searchMode = true
            options.isLoading = false
            this.options = options
            this.showDropdownList()
          })
        }
      },
      computedDropdownTop () {
        if (typeof window === 'undefined' || typeof this.$refs.dropdownList === 'undefined') {
          return
        }

        const spaceAbove = this.$el.getBoundingClientRect().top
        const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom
        const hasEnoughSpaceBelow = spaceBelow > 250

        if (hasEnoughSpaceBelow || spaceBelow > spaceAbove) {
          this.$refs.dropdownList.style.bottom = null
        } else {
          this.$refs.dropdownList.style.bottom = '100%'
        }
      },
      handleLoadOptionImage () {
        this.computedDropdownTop()
      },
      getValue (name) {
        return this[name] === null
          ? this.$multiselectGlobalOptions[name]
          : this[name]
      },
      getResultValue (selectedOptions) {
        let options = Object.assign([], selectedOptions)
        let modifyOptions = []

        for (let index in options) {
          if (options[index] instanceof Object) {
            let keyName = this.getValue('optionKeyName')
            let titleName = this.getValue('optionTitleName')
            modifyOptions.push(options[index].hasOwnProperty(keyName) ? options[index][keyName] : options[index][titleName])
          } else {
            modifyOptions.push(options[index])
          }
        }

        if (this.getValue('isMulti')) {
          return modifyOptions
        } else if (modifyOptions.length) {
          return modifyOptions[0]
        }

        return null
      }
    },
    watch: {
      query (query) {
        if (query.length) {
          if (this.asyncSearchCallback || this.asyncSearchUrl) {
            this.asyncSearch(this.query)
          } else {
            this.showDropdownList()
            this.dropdownHoverIndex = 0
          }
        } else {
          this.hideDropdownList()
          this.options.searchMode = false
        }
      },
      isShowDropdownList (show) {
        if (show) {
          this.computedDropdownTop()
          this.dropdownWidth = this.$el.offsetWidth + 'px'
        }
      },
      value (value) {
        let resultValue = this.getResultValue(this.options.selected)
        let isUpdated = false
        if (Array.isArray(value) && Array.isArray(resultValue) && value.length === resultValue.length) {
          for (let index = 0; index < value.length; index++) {
            if (resultValue.indexOf(value[index]) === -1) {
              isUpdated = true
              break
            }
          }
        } else {
          isUpdated = true
        }

        if (isUpdated) {
          let options = Object.assign([], this.options)
          options.selected = Array.isArray(value) ? value : (value === null ? [] : [value])
          this.options = options
        }
      },
      options (newValue, oldValue) {
        if (newValue.selected !== oldValue.selected) {
          let result = this.getResultValue(newValue.selected)
          this.$emit('input', result)
          this.$emit('change', result)
        }
      }
    },
    created () {
      let $vue = this
      let options = Object.assign({}, $vue.options)
      options.default = $vue.default
      $vue.options = options

      document.addEventListener('click', function () {
        setTimeout(function () {
          $vue.hideDropdownList()
        }, 0.1)
      })

      // Заполняем выбранные значения
      if (this.value) {
        let options = Object.assign({}, this.options)
        if (Array.isArray(this.value)) {
          options.selected = Object.assign([], this.value)
        } else {
          options.selected = [this.value]
        }
        this.options = options
      }

      // Заполняем значения по умолчанию
      if (Array.isArray(this.allValues)) {
        let options = Object.assign({}, this.options)
        options.default = Object.assign([], this.allValues)
        this.options = options
      }

      // При изменении размера экрана, и скроллинге, определяем с какой стороны показывать выпадающий список
      window.addEventListener('resize', function () {
        $vue.computedDropdownTop()
      })
      window.addEventListener('scroll', function () {
        $vue.computedDropdownTop()
      })
    },
    updated () {
      this.computedDropdownTop()
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