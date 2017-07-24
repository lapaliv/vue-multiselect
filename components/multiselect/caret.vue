<template>
    <div class="d-inline-flex py-2 px-3" @click="handleClickCaret" v-if="dropdownListCount"
        :class="{'align-self-center': optionsCount <= 1, 'align-self-end': optionsCount > 1}"
    >
        <i class="fa" :class="{'fa-caret-up': isShowDropdownList, 'fa-caret-down': !isShowDropdownList}"></i>
    </div>
</template>

<script>
    export default {
        props: {
            dropdownListCount: {type: Number, required: true},
            isShowDropdownList: {type: Boolean},
            onShowDropdownList: {type: Function},
            onHideDropdownList: {type: Function},
            optionsCount: {type: Number, required: true}
        },
        data() {
            return {};
        },
        computed: {},
        methods: {
            handleClickCaret(event) {
                event.stopPropagation();
                if(this.isShowDropdownList) {
                    this.onHideDropdownList();
                } else {
                    this.onShowDropdownList();
                }
            },
        }
    };
</script>