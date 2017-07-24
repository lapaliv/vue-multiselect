<template>
    <div class="m-2"
         :class="{'d-flex': short}"
         v-if="isShowSearch && options.length"
    >
        <component is="tag" v-for="(option, key) in options"
                   :key="typeof option === 'object' ? option[keyName] : key"
                   :title-name="titleName"
                   :image-name="imageName"
                   :key-name="keyName"
                   :option="option"
                   :short="short"
                   :on-drop="handleDrop"
        ></component>
    </div>
    <div v-else-if="!isShowSearch && options.length" class="d-flex">
        <div class="m-0 d-inline-flex w-100">
            <div class="m-2" :class="{'w-100': !short}" v-if="options.length">
                <component is="tag" v-for="(option, key) in options"
                           :key="typeof option === 'object' ? option[keyName] : key"
                           :title-name="titleName"
                           :image-name="imageName"
                           :key-name="keyName"
                           :option="option"
                           :short="short"
                           :on-drop="handleDrop"
                ></component>
            </div>
        </div>
        <component is="caret"
                   :options-count="options.length"
                   :dropdown-list-count="dropdownListCount"
                   :is-show-dropdown-list="isShowDropdownList"
                   :on-show-dropdown-list="onShowDropdownList"
                   :on-hide-dropdown-list="onHideDropdownList"
        ></component>
    </div>
</template>

<script>
    import tag from './tags/tag.vue';
    import caret from './caret.vue';

    export default {
        components: {tag, caret},
        props: {
            short: {type: Boolean, required: true},
            options: {type: [Array, Object], default: function() {
                return [];
            }},
            titleName: {type: String},
            imageName: {type: String},
            keyName: {type: String},
            onDrop: {type: Function, required: true},
            dropdownListCount: {type: Number, required: true},
            isShowDropdownList: {type: Boolean},
            onShowDropdownList: {type: Function},
            onHideDropdownList: {type: Function},
            isShowSearch: {type: Boolean},
        },
        data() {
            return {};
        },
        computed: {

        },
        methods: {
            handleDrop(option) {
                event.stopPropagation();
                this.onDrop(option);
            }
        }
    };
</script>