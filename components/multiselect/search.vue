<template>
    <div class="d-flex" v-if="isShow">
        <input type="text"
               v-model="query"
               class="m-0 d-inline-flex form-control w-100 border-0 rounded"
               :placeholder="placeholder"
               @focus="handleInputFocus"
               @click="handleInputFocus"
        />
        <component is="caret"
                   :options-count="optionsCount"
                   :dropdown-list-count="dropdownListCount"
                   :is-show-dropdown-list="isShowDropdownList"
                   :on-show-dropdown-list="onShowDropdownList"
                   :on-hide-dropdown-list="onHideDropdownList"
        ></component>
    </div>
</template>

<script>
    import caret from './caret.vue';
    export default {
        components: {caret},
        props: {
            placeholder: {type: String, default: 'Start typing...'},
            isShowDropdownList: {type: Boolean},
            onShowDropdownList: {type: Function},
            onHideDropdownList: {type: Function},
            onSearch: {type: Function, required: true},
            searchUrl: {type: String, default: null},
            dropdownListCount: {type: Number, required: true},
            isMulti: {type: Boolean},
            isShow: {type: Boolean, required: true},
            optionsCount: {type: Number, required: true}
        },
        data() {
            return {
                query: null
            };
        },
        computed: {},
        methods: {
            handleInputFocus(event) {
                event.stopPropagation();
                if(this.query !== null && this.query.length) {
                    this.onShowDropdownList();
                }
            }
        },
        watch: {
            query(query) {
                if(query !== null && query.length) {
                    let $vue = this;
                    setTimeout(() => {
                        if ($vue.query === query) {
                            this.onSearch(query === null ? null : (!query.length ? null : query));
                        }
                    }, 200);
                }
            }
        }
    };
</script>