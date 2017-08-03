<template>
    <table class="tag rounded" :class="{'w-100': !short, 'mr-2': short, 'mb-2': optionsCount > 1}">
        <tr>
            <td class="image align-top p-0" v-if="image !== null">
                <img :src="image" :alt="option[titleName]"/>
            </td>
            <td class="text-left align-middle p-2" :class="{'w-100': !short}">{{ option[titleName] }}</td>
            <td class="action p-2" @click="onDrop(option, $event)">
                <i class="fa fa-remove"></i>
            </td>
        </tr>
    </table>
</template>

<script>
  export default {
    props: {
      short: {type: Boolean, required: true},
      option: {type: [Object, String], default: null},
      titleName: {type: String, default: 'title'},
      imageName: {type: String, default: 'image'},
      keyName: {type: String, default: 'id'},
      onDrop: {type: Function, required: true},
      optionsCount: {
        type: Number,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      image () {
        if (this.option.hasOwnProperty(this.imageName) && this.option[this.imageName]) {
          return this.option[this.imageName]
        }

        return null
      }
    }
  }
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
        flex-wrap: wrap;
    }

    .tag .action {
        text-align: center;
        color: #000;
        border-bottom-right-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        width: 40px;
    }

    .tag .action:hover {
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
        cursor: pointer;
    }

    .tag .image {
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
        text-align: left;
        background: #fff;
        border-right: 3px solid #fff;
    }

    .tag .image img {
        max-width: 80px;
        max-height: 50px;
        border-bottom-left-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
        outline: none;
    }
</style>