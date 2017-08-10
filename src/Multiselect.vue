<template>
    <div class="form-control p-0 multiselect"
         tabindex="1"
         @keydown="handleKeyDown"
    >
        <component is="tags"
                   :short="shortTags"
                   :options="options"
                   :title-name="optionTitleName"
                   :image-name="optionImageName"
                   :key-name="optionKeyName"
                   :on-drop="handleDropOption"
                   :dropdown-list-count="Object.keys(dropdownOptions).length"
                   :is-show-dropdown-list="showDropdownList"
                   :on-show-dropdown-list="handleShowDropdownList"
                   :on-hide-dropdown-list="handleHideDropdownList"
                   :is-show-search="showSearch"
        ></component>
        <component is="search"
                   :is-show-dropdown-list="showDropdownList"
                   :dropdown-list-count="Object.keys(dropdownOptions).length"
                   :on-show-dropdown-list="handleShowDropdownList"
                   :on-hide-dropdown-list="handleHideDropdownList"
                   :placeholder="placeholder"
                   :on-search="handleSearch"
                   :is-show="showSearch"
                   :options-count="options.length"
        ></component>
        <component is="stub"
                   :is-show-dropdown-list="showDropdownList"
                   :dropdown-list-count="Object.keys(dropdownOptions).length"
                   :on-show-dropdown-list="handleShowDropdownList"
                   :on-hide-dropdown-list="handleHideDropdownList"
                   :placeholder="stubPlaceholder"
                   :is-show="showStub"
                   :options-count="options.length"
        ></component>
        <component is="list"
                   :show="showDropdownList"
                   :options="dropdownOptions"
                   :on-select="handleSelectFromDropdownList"
                   :on-hide="handleHideDropdownList"
                   :title-name="optionTitleName"
                   :image-name="optionImageName"
                   :key-name="optionKeyName"
        ></component>
        <input type="hidden" :name="name + (isMulti ? '[]' : '')" v-for="option in options" v-if="attachInput"
               :value="option.id"/>
    </div>
</template>

<script>
  import tags from './components/Tags.vue'
  import search from './components/Search.vue'
  import list from './components/List.vue'
  import stub from './components/Stub.vue'
  import axios from 'axios'

  export default {
    components: {tags, search, list, stub},
    props: {
      shortTags: {type: Boolean},
      placeholder: {type: String},
      stubPlaceholder: {type: String},
      optionTitleName: {type: String, default: 'title'},
      optionImageName: {type: String, default: 'image'},
      optionKeyName: {type: String, default: 'id'},
      asyncSearchCallback: {type: Function, default: null},
      asyncSearchUrl: {type: String, default: null},
      name: {type: String, default: null},
      attachInput: {type: Boolean, default: false},
      isMulti: {type: Boolean, default: false},
      isSearch: {type: Boolean, default: true},
      noResultsPlaceholder: {type: String, default: 'No results'},
      value: {
        type: [Array, Object, String],
        default: function () {
          return []
        }
      },
      allValues: {
        type: [Array, Object],
        default: function () {
          return []
        }
      },
      onChange: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        showDropdownList: false,
        selectedOptions: [],
        searchOptions: null,
        defaultSearchOptions: []
      }
    },
    computed: {
      options () {
        return this.selectedOptions
      },
      dropdownOptions () {
        let results = []
        let options = this.searchOptions instanceof Object ? this.searchOptions : this.defaultSearchOptions
        let selected = this.options
        for (let index = 0; index < options.length; index++) {
          let isSearch = false
          for (let selectedIndex = 0; selectedIndex < selected.length; selectedIndex++) {
            if (selected[selectedIndex][this.optionKeyName] === options[index][this.optionKeyName]) {
              isSearch = true
            }
          }

          if (!isSearch) {
            results.push(options[index])
          }
        }

        return results
      },
      showSearch () {
        return !!(this.isSearch && (this.isMulti || !Object.keys(this.options).length))
      },
      showStub () {
        return !!((!this.isSearch || (!this.isMulti && Object.keys(this.options).length)) && !this.options.length)
      }
    },
    methods: {
      handleShowDropdownList () {
        this.showDropdownList = true
      },
      handleHideDropdownList () {
        this.showDropdownList = false
      },
      handleSelectFromDropdownList (option) {
        if (this.isMulti) {
          let results = Object.assign([], this.selectedOptions)
          results.push(option)
          this.selectedOptions = results
        } else {
          this.selectedOptions = [option]
        }

        if (!this.dropdownOptions.length || !this.isMulti) {
          this.handleHideDropdownList()
        }

        if (this.onChange instanceof Function) {
          this.onChange(this.selectedOptions)
        }
      },
      handleDropOption (option) {
        let result = []
        for (let index = 0; index < this.selectedOptions.length; index++) {
          if (this.selectedOptions[index] !== option) {
            result.push(this.selectedOptions[index])
          }
        }

        this.selectedOptions = result

        // Добавляем удаленный элемент в список найденных
        if (this.searchOptions instanceof Object && this.searchOptions.indexOf(option) === -1) {
          this.searchOptions.push(option)
        }
      },
      handleSearch (query) {
        if (query === null) {
          this.searchOptions = null
          return
        }

        query = query.toLowerCase()

        if (this.asyncSearchCallback instanceof Function || this.asyncSearchUrl !== null) {
          this.handleHideDropdownList()
          let $vue = this
          let promise = null
          if (this.asyncSearchUrl !== null) {
            promise = axios.get(this.asyncSearchUrl + (this.asyncSearchUrl.indexOf('?') === -1 ? '?' : '&') + 'query=' + query)
          } else {
            promise = this.asyncSearchCallback(query)
          }

          if (typeof promise.then === 'function' && typeof promise.catch === 'function') {
            promise
              .then((res) => {
                $vue.searchOptions = $vue.convertOptionsToObjects(res.data)
                this.handleShowDropdownList()
              })
              .catch((res) => {
                console.log('Error response', res)
                this.handleShowDropdownList()
              })

            return
          }
        }

        let results = []
        let options = Object.assign([], this.defaultSearchOptions)
        for (let index = 0; index < options.length; index++) {
          if (options[index][this.optionTitleName].toLowerCase().indexOf(query) !== -1) {
            results.push(options[index])
          }
        }

        this.searchOptions = results
        this.handleShowDropdownList()
      },
      convertOptionsToObjects (options) {
        let results = []

        if (typeof options === 'string') {
          options = [options]
        }

        if (Array.isArray(options)) {
          for (let index = 0; index < options.length; index++) {
            if (options[index] instanceof Object) {
              let obj = options[index]
              if (typeof obj[this.optionTitleName] === 'undefined') {
                continue
              }
              if (typeof obj[this.optionKeyName] === 'undefined') {
                obj[this.optionKeyName] = obj[this.optionTitleName]
              }
              obj[this.optionKeyName] = Number.isInteger(obj[this.optionKeyName]) ? parseInt(obj[this.optionKeyName]) : obj[this.optionKeyName]
              results.push(obj)
            } else {
              options[index] = Number.isInteger(options[index]) ? parseInt(options[index]) : options[index]
              let searchInDefaultSearchOptions = false
              if (this.defaultSearchOptions.length) {
                for (let itemIndex = 0; itemIndex < this.defaultSearchOptions.length; itemIndex++) {
                  if (this.defaultSearchOptions[itemIndex][this.optionKeyName] + '' === options[index] + '') {
                    results.push(this.defaultSearchOptions[itemIndex])
                    searchInDefaultSearchOptions = true
                    break
                  }
                }
              }
              if (!searchInDefaultSearchOptions) {
                results.push({
                  [this.optionKeyName]: options[index],
                  [this.optionTitleName]: options[index]
                })
              }
            }
          }
        } else if (typeof options[this.optionKeyName] !== 'undefined' && typeof options[this.optionTitleName] !== 'undefined' && !this.isMulti) {
          options[this.optionKeyName] = Number.isInteger(options[this.optionKeyName]) ? parseInt(options[this.optionKeyName]) : options[this.optionKeyName]
          let object = {
            [this.optionKeyName]: options[this.optionKeyName],
            [this.optionTitleName]: options[this.optionTitleName]
          }
          if (typeof options[this.optionImageName] !== 'undefined') {
            object[this.optionImageName] = options[this.optionImageName]
          }
          results.push(object)
        } else {
          for (let key in options) {
            let id = Number.isInteger(key) ? parseInt(key) : key
            results.push({
              [this.optionKeyName]: id,
              [this.optionTitleName]: options[key]
            })
          }
        }

        return results
      },
      getChildrenByName (name) {
        for (let index = 0; index < this.$children.length; index++) {
          let child = this.$children[index]
          if (child.$options._componentTag === name) {
            return child
          }
        }

        return null
      },
      handleKeyDown (event) {
        let dropdown = this.getChildrenByName('list')
        let search = this.getChildrenByName('search')

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (!this.showDropdownList) {
            this.handleShowDropdownList()
          } else {
            dropdown.handlePressDown()
          }
        } else if (event.key === 'ArrowUp' && this.showDropdownList) {
          event.preventDefault()
          dropdown.handlePressUp()
        } else if (event.key === 'Enter' && this.showDropdownList) {
          dropdown.handleSelect(dropdown.$options.propsData.options[dropdown._data.hoverIndex], event)
          if (!this.isMulti) {
            dropdown._data.hoverIndex = null
          }
        } else if (event.key !== 'Tab' && this.showSearch) {
          search.$refs.input.focus()
        } else if (event.key === 'Tab') {
          this.handleHideDropdownList()
        }
      }
    },
    mounted () {
      this.defaultSearchOptions = this.convertOptionsToObjects(this.allValues)
      this.selectedOptions = this.convertOptionsToObjects(this.value)
    }
  }
</script>

<style>
    input:focus {
        outline: none;
    }

    .multiselect {
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        min-height: 36px;
    }
</style>
