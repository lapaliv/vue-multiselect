<template>
    <div>
        <div tabindex="0" class="form-control multiselect py-1 pr-1" ref="select" @keydown="handleKeyDown">
            <ul class="list-group mb-2 mt-1 mr-2" v-if="options.selected.length">
                <li v-for="(option, key) in options.selected"
                    class="list-group-item individual-item list-group-item-success p-0 d-flex flex-row"
                >
                    <img v-if="option instanceof Object && option.hasOwnProperty(optionImageName)"
                         :src="option[optionImageName]"
                         :alt="option[optionTitleName]"
                    />
                    <div class="flex-column flex-wrap py-2 pl-3 align-self-center w-100">
                        {{ option instanceof Object ? option[optionTitleName] : option }}
                    </div>
                    <input type="hidden"
                           v-if="attachInput"
                           :name="name"
                           :value="option instanceof Object ? (option.hasOwnProperty(optionKeyName) ? option[optionKeyName] : option[optionTitleName]) : option"
                    >
                    <i class="icon-cancel float-right d-flex flex-column m-2 align-self-center"
                       @click="handleClickByDeleteFromSelectedOptions($event, option)"></i>
                </li>
            </ul>
            <div class="d-flex flex-row">
                <input type="text" class="d-inline-block py-1 flex-column border-0"
                       :placeholder="placeholder"
                       v-model="query"
                       ref="input"
                       tabindex="-1"
                       @focus="handleFocusInput"
                >
                <i v-if="!options.isLoading" class="mx-2 my-1 flex-column"
                   :class="{'icon-angle-down': !isShowDropdownList, 'icon-angle-up': isShowDropdownList}"
                   @click="handleClickByCaret"
                ></i>
                <i v-else
                   class="icon-spin1 animate-spin float-right d-flex flex-column mx-2 my-1 align-self-center"></i>
            </div>
        </div>
        <div v-if="isShowDropdownList" ref="dropdownList" class="mt-1 dropdown-list" :style="{width: dropdownWidth}">
            <ul class="list-group">
                <li v-for="(option, index) in dropdownOptions"
                    @click="handleSelectDropdownOption($event, option)"
                    @mouseover="dropdownHoverIndex = index"
                    class="list-group-item py-1 px-3"
                    :class="{'bg-light': dropdownHoverIndex === index}"
                >
                    <img v-if="option instanceof Object && option.hasOwnProperty(optionImageName)"
                         class="mr-2"
                         :src="option[optionImageName]"
                         :alt="option[optionTitleName]"
                    />
                    {{ option instanceof Object ? option[optionTitleName] : option }}
                </li>
                <li v-if="!Object.keys(dropdownOptions).length" class="list-group-item text-muted py-2 px-3">
                    Ничего не найдено. Вы можете создать <a href="">Тут текст ввода</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
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
        'default': true
      },
      name: {
        type: String,
        'default': null
      },
      isMulti: {
        type: Boolean,
        'default': true
      },
      optionKeyName: {
        type: String,
        'default': 'id'
      },
      optionTitleName: {
        type: String,
        'default': 'title'
      },
      optionImageName: {
        type: String,
        'default': 'image'
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
        'default': 'Start typing...'
      },
      value: {
        type: [String, Object, Array, null],
        'default': null
      },
      allValues: {
        type: Array,
        'default': null
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
        dropdownBoxShadow: null
      }
    },
    computed: {
      dropdownOptions () {
        let results = {}
        let options = this.options.searchMode ? this.options.search : this.options.default

        for (let key in options) {
          let title = options[key] instanceof Object ? options[key][this.optionTitleName] : options[key]

          let queryIsEmpty = !this.query.length
          let titleIsFind = title.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
          let optionHasNotInSelected = this.options.selected.indexOf(options[key]) === -1

          if ((queryIsEmpty || titleIsFind) && optionHasNotInSelected) {
            let searchInSelected = false
            for (let index in this.options.selected) {
              let selectedTitle = this.options.selected[index] instanceof Object
                ? this.options.selected[index][this.optionTitleName]
                : this.options.selected[index]
              if (queryIsEmpty || selectedTitle.toLowerCase() === title.toLowerCase()) {
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
      dropdownWidth () {
        return this.$refs.select.offsetWidth + 'px'
      }
    },
    methods: {
      showDropdownList () {
        this.isShowDropdownList = true
      },
      hideDropdownList () {
        this.isShowDropdownList = false
      },
      handleClickByCaret (event) {
        if (!this.isShowDropdownList) {
          let $vue = this
          setTimeout(function () {
            $vue.showDropdownList()
          }, 100)
        } else {
          this.hideDropdownList()
        }
      },
      setOptions (type, data) {
        let options = Object.assign({}, this.options)
        options[type] = Object.assign([], data)
        this.options = options
      },
      handleSelectDropdownOption (event, option) {
        let selectedOptions = Object.assign([], this.options.selected)
        if (this.isMulti) {
          selectedOptions.push(option)
        } else {
          selectedOptions = [option]
        }
        this.setOptions('selected', selectedOptions)
        if (Object.keys(this.dropdownOptions).length && this.isMulti) {
          event.stopPropagation()
        }
      },
      handleClickByDeleteFromSelectedOptions ($event, option) {
        let results = []
        for (let index = 0; index < this.options.selected.length; index++) {
          if (this.options.selected[index] !== option) {
            results.push(this.options.selected[index])
          }
        }
        this.setOptions('selected', results)
      },
      handleKeyDown (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (this.isShowDropdownList) {
            let search = false
            for (let key in this.dropdownOptions) {
              if (!search && this.dropdownHoverIndex === -1) {
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
          if (!this.isMulti) {
            this.hideDropdownList()
          }
          this.dropdownHoverIndex = 0
        } else if (event.key !== 'Tab') {
          this.$refs.input.focus()
        } else if (event.key === 'Tab') {
          this.hideDropdownList()
        }
      },
      handleFocusInput (event) {
        let $vue = this
        setTimeout(function () {
          $vue.showDropdownList()
          $vue.$refs.select.focus()
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
        if (this.isShowDropdownList && this.$refs.dropdownList) {
          let selectPosition = this.$refs.select.getBoundingClientRect()
          this.dropdownDefaultTop = this.dropdownDefaultTop || this.$refs.dropdownList.offsetTop
          let dropdownIsLong = selectPosition.top + this.$refs.select.offsetHeight + this.$refs.dropdownList.offsetHeight > window.innerHeight

          if (dropdownIsLong && this.$refs.select.offsetHeight < window.innerHeight / 2) {
            this.dropdownTop = (this.$refs.dropdownList.offsetHeight - 25) * -1
            this.dropdownBoxShadow = '0 0px 10px rgba(0, 0, 0, .3)'
          } else {
            this.dropdownTop = this.dropdownTop < 0
              ? this.dropdownDefaultTop
              : this.$refs.select.offsetHeight + 35
            this.dropdownBoxShadow = '0 5px 10px rgba(0, 0, 0, .3)'
          }

          this.$refs.dropdownList.style.top = this.dropdownTop + 'px'
          this.$refs.dropdownList.style.boxShadow = this.dropdownBoxShadow
        }
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

    input {
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

    .icon-cancel:hover, .icon-angle-down:hover, .icon-angle-up:hover {
        opacity: 0.8;
        cursor: pointer;
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
</style>