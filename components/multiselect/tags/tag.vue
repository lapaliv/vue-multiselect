<template>
    <div class="tag rounded" :class="{'d-flex': !short, 'd-inline-flex': short}">
        <div class="image" v-if="image !== null">
            <img :src="image" :alt="option[titleName]" />
        </div>
        <div class="title">{{ option[titleName] }}</div>
        <div class="action" @click="onDrop(option, $event)">
            <i class="fa fa-remove"></i>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            short: {type: Boolean, required: true},
            option: {type: [Object, String], default: null},
            titleName: {type: String, default: 'title'},
            imageName: {type: String, default: 'image'},
            keyName: {type: String, default: 'id'},
            onDrop: {type: Function, required: true}
        },
        data() {
            return {};
        },
        computed: {
            image() {
                if(this.option.hasOwnProperty(this.imageName) && this.option[this.imageName]) {
                    return this.option[this.imageName];
                }

                return null;
            }
        },
        methods: {}
    };
</script>

<style>
    .tag {
        background: #41b883;
        border-radius: 0.25rem;
        color: #fff;
        flex-direction: row;
        justify-content: space-around;
        align-items: stretch;
        cursor: default;
    }

    .tag.d-flex {
        margin-top: 0.5rem;
    }

    .tag.d-flex:first-child {
        margin-top: 0;
    }

    .tag.d-inline-flex {
        margin-left: 0.5rem;
    }

    .tag.d-inline-flex:first-child {
        margin-left: 0;
    }

    .tag .action {
        text-align: center;
        color: #000;
        border-bottom-right-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        padding: 0.5rem 0.75rem;
        justify-content: center;
        flex-direction: column;
    }

    .tag .action:hover {
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
        cursor: pointer;
    }

    .tag .title:first-child {
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
    }

    .tag .title {
        width: 100%;
        padding: 0.5rem 1rem;
        justify-content: center;
    }

    .tag .image {
        background: #eeeeee;
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
        text-align: center;
    }

    .tag .image img {
        max-width: 80px;
        max-height: 50px;
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
        outline: 3px solid #fff;
    }
</style>