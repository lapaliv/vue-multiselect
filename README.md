# vue-bootstrap-multiselect

The package may selected (one or many) options from list.
Developed on Vue.js 2 and Bootstrap 4 without jQuery

#### Demo

[JSFiddle](https://jsfiddle.net/lapaliv/xrezntfx/)

## Achievements

* Control by keys in keyboard (arrow up/down, enter)
* Focused by TAB button
* Simple async-search (by url address) and complex async-search (by callback)
* Attaching (if you need) inputs to form with selected options
* Support short and long tags
* Support objects|array of base types (strings, numbers, etc)|array of objects as value
* Support images, search/stub, change-callback function, ect...

## Install

```
npm install --save vue-bootstrap-multiselect
```

#### ES6
```js
import Multiselect from 'vue-bootstrap-multiselect';
Vue.component('multiselect', Multiselect);
```

#### SDN
```html
<link type="text/css" rel="stylesheet" href="https://unpkg.com/vue-bootstrap-multiselect/dist/vue-bootstrap-multiselect.min.css" /> 
<script type="text/javascript" src="https://unpkg.com/vue-bootstrap-multiselect/dist/vue-bootstrap-multiselect.min.js"></script> 
```

## Setup

```vuejs
<div id="vue">
    // ... other html code 
    <component is="multiselect" :on-change="handleSelect"></component>
    // ... other html code
</div>

<script>
    const app = new Vue({
        el: '#vue',
        methods: {
            handleSelect(options) {
                console.log(options);
            }
        }
    })
</script>
```

## Props

| Name                   | Type            | Default         | Description                                               |
|----------------------- | --------------- | --------------- | ----------------------------------------------------------|
| name                   | String          | -               | The multiselect name on form                              |
| is-multi               | Boolean         | false           | Determines whether multiple options can be selected       |
| stub-placeholder       | String          | Select option   | Placeholder of stub (where search is off)                 |
| is-search              | Boolean         | true            | Enable or disable searching by list of options            |
| placeholder            | String          | Start typing... | Placeholder for input search                              |
| async-search-callback  | Function        | -               | Complex search callback for manual search by query        |
| async-search-url       | String          | -               | Simple search URL for GET request and pulling JSON string |
| value                  | Array or Object | []              | Selected options                                          |
| all-values             | Array or Object | []              | Default options for dropdown list                         |
| option-title-name      | String          | title           | Name for title field of option                            |
| option-image-name      | String          | image           | Name for image link field of option                       |
| option-key-name        | String          | id              | Name for id field of option                               |
| short-tags             | Boolean         | false           | Enable or disable short tags (default - long tags)        |
| attach-input           | Boolean         | false           | Enable attached hidden inputs for form                    |
| on-сhange              | Function        | null            | Selected-callback. Called each time you select options    |
| no-results-placeholder | String          | No results      | Dropdown list placeholder for empty result                |

### #attach-input

**For example**

```vuejs
<component is="multiselect" :attach-input="true" name="tags"></component>
```

**Result**
```html
<input type="hidden" name="tags[]" value="1"/>
<input type="hidden" name="tags[]" value="2"/>
<input type="hidden" name="tags[]" value="3"/>
```

### #value

**For example 1**
```vuejs
<component is="multiselect"
           :value='{
               "apple": "Яблоко",
               "banana": "Banana",
               "man": "Jon"
           }'
></component>
```
or

```vuejs
<component is="multiselect"
           :value='[
               {"id": "apple", "title": "Яблоко"},
               {"id": "banana", "title": "Banana"},
               {"id": "man", "title": "Jon"}
           ]'
></component>
```

**Result 1**
1. id = apple, title = Яблоко
2. id = banana, title = Banana
3. id = man, title = Jon

**For example 2**
```vuejs
<component is="multiselect" :value='["apple","banana","man"]'></component>
```

**Result 2**
1. id = apple, title = apple
2. id = banana, title = banana
3. id = man, title = man

## For developers

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
