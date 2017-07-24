<template>
    <ul class="list-group mt-1" v-if="show" :style="width === null ? null : ('width:' + width + 'px')">
        <li class="list-group-item py-2 px-3" v-if="!options.length">
            Нет элементов для отображения
        </li>
        <li class="list-group-item list-group-item-action p-2" v-for="option in options" @click="handleSelect(option, $event)">
            <img :src="option[imageName]" v-if="option.hasOwnProperty('image')" class="mr-2">
            <span :class="{'pl-1': !option.hasOwnProperty('image')}">{{ option[titleName] }}</span>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            show: {type: Boolean, default: false},
            titleName: {type: String},
            imageName: {type: String},
            keyName: {type: String},
            onSelect: {type: Function},
            onHide: {type: Function},
            options: {type: Array, default: function() {
                return [];
            }},
        },
        data() {
            return {
                width: null
            };
        },
        computed: {},
        methods: {
            handleSelect(option, event) {
                event.stopPropagation();
                this.onSelect(option);
            }
        },
        mounted() {
            let $vue = this;
            document.addEventListener('click', function() {
                $vue.onHide();
            });
            this.width = this.$parent.$el.offsetWidth;
        }
    };
</script>

<style>
    ul.list-group {
        z-index: 2000;
        box-shadow: 0 10px 10px rgba(0,0,0,0.3);
        border-radius: 0.25rem;
        position: absolute;
    }
    li.list-group-item-action {
        cursor: pointer;
    }
    li.list-group-item-action img{
        max-width: 80px;
        max-height: 50px;
    }

</style>