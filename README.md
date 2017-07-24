# vue-bootstrap-multiselect

Пакет позволяет заменить стандартные средства выборки элементов с использованием Vue.js 2 и bootstrap 4

## Установка (Install)

```
npm install --save vue-bootstrap-multiselect
```

```js
import Multiselect from 'vue-bootstrap-multiselect';
Vue.component('multiselect', Multiselect);
```

## Настройка (Setup)

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

## Атрибуты (Props)

| Name                  | Type            | Default         | Description                                                                                                                                                                                    |
|---------------------- | --------------- | --------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                  | String          | -               | Имя мультиселекта                                                                                                                                                                              |
| is-multi              | Boolean         | false           | Определяет, можно ли использовать мульти выборку (несколько параметров)                                                                                                                        |
| stub-placeholder      | String          | Select option   | Placeholder для заглушки (используется вместо строки поиска)                                                                                                                                   |
| is-search             | Boolean         | true            | Определяет, можно ли выполнять поиск по параметрам мультиселекта при выборке                                                                                                                   |
| placeholder           | String          | Start typing... | Placeholder для поля поиска                                                                                                                                                                    |
| async-search-callback | Function        | -               | Callback, контролирующий поиск для мультиселекта                                                                                                                                               |
| async-search-url      | String          | -               | URL, который ищет и отдает найденные параметры в виде json-строки                                                                                                                              |
| value                 | Array or Object | []              | Параметры, выбранные по умолчанию (структуру объекта см. ниже)                                                                                                                                 |
| all-values            | Array or Object | []              | Параметры мультиселекта по умолчанию, из которых можно выбирать (структуру объекта см. ниже)                                                                                                   |
| option-title-name     | String          | title           | Имя ключа в параметре-объекте, отвечающего за заголовок                                                                                                                                        |
| option-image-name     | String          | image           | Имя ключа в параметре-объекте, отвечающего за ссылку на изображение                                                                                                                            |
| option-key-name       | String          | id              | Имя ключа в параметре-объекте, отвечающего за уникальный ключ объекта                                                                                                                          |
| short-tags            | Boolean         | false           | Определяет, нужно ли отображать выбранные параметры в коротком формате (несколько параметров на одной строке)                                                                                  |
| attach-input          | Boolean         | false           | Определяет, нужно ли прикреплять input'ы с ключами выбранных параметров. Если мульти выборка поддерживается, то будет создано несколько input'ов с именем name[], где name - имя мультиселекта |
| on-сhange             | Function        | null            | Callback, вызывается при каждом выборе параметра. Принимает массив из выбранных параметров                                                                                                     |

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
