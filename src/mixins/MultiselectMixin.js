import axios from 'axios'

export default {
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
          ? options[key][this.getProp('optionTitleName')]
          : options[key]

        let queryIsEmpty = !this.query.length
        let titleIsFind = title.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
        let optionHasNotInSelected = this.options.selected.indexOf(options[key]) === -1

        if ((queryIsEmpty || titleIsFind) && optionHasNotInSelected) {
          let searchInSelected = false
          for (let index in this.options.selected) {
            let selectedTitle = this.options.selected[index] instanceof Object
              ? this.options.selected[index][this.getProp('optionTitleName')]
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
    countSelectedOptions () {
      return this.options.selected.length
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
        if (this.getProp('isMulti')) {
          selectedOptions.push(option)
        } else {
          selectedOptions = [option]
        }
        this.setOptions('selected', selectedOptions)
        if (Object.keys(this.dropdownOptions).length && this.getProp('isMulti')) {
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
        if (!this.getProp('isMulti')) {
          this.hideDropdownList()
        }
        for (let key in this.dropdownOptions) {
          this.dropdownHoverIndex = key
          break
        }
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
        this.$refs.dropdownList.style.bottom = 'calc(100% - 24px)'
      }
    },
    handleLoadOptionImage () {
      this.computedDropdownTop()
    },
    getProp (name) {
      return this[name] === null
        ? this.$multiselectGlobalOptions[name]
        : this[name]
    },
    getResultValue (selectedOptions) {
      let options = Object.assign([], selectedOptions)
      let modifyOptions = []

      for (let index in options) {
        if (options[index] instanceof Object) {
          let keyName = this.getProp('optionKeyName')
          let titleName = this.getProp('optionTitleName')
          modifyOptions.push(options[index].hasOwnProperty(keyName) ? options[index][keyName] : options[index][titleName])
        } else {
          modifyOptions.push(options[index])
        }
      }

      if (this.getProp('isMulti')) {
        return modifyOptions
      } else if (modifyOptions.length) {
        return modifyOptions[0]
      }

      return null
    },
    getOptionTitle (option) {
      return option instanceof Object && option.hasOwnProperty(this.getProp('optionTitleName'))
        ? option[this.getProp('optionTitleName')]
        : option
    },
    getOptionImage (option) {
      return option instanceof Object && option.hasOwnProperty(this.getProp('optionImageName'))
        ? option[this.getProp('optionImageName')]
        : null
    },
    getOptionKey (option) {
      return option instanceof Object && option.hasOwnProperty(this.getProp('optionKeyName'))
        ? option[this.getProp('optionKeyName')]
        : this.getOptionTitle(option)
    },
    getOptionHighlightTitle (option) {
      let title = this.getOptionTitle(option)
      if (this.query.length) {
        return title.replace(new RegExp('(' + this.query + ')', 'gi'), '<span style="background: #fff2a8;">$1</span>')
      }

      return title
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
