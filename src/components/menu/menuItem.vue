<template>
  <li class="menu-item"
      @click.stop="handleClick"
      :style="paddingStyle"
      :class="{'is-active':active}"
      :key="index">
    <slot></slot>
  </li>
</template>

<script>
  import menuMix from './mixin';

  export default {
    mixins: [menuMix],
    name: 'EcMenuItem',
    props: {
      index: {
        type: [String, Number],
        require: true
      },
      value: ''
    },
    computed: {
      active() {
        return this.index === this.rootMenu.active;
      }
    },
    methods: {
      /**
       * ================
       * 点击事件
       * ================
       * */
      handleClick() {
        this.rootMenu.handleItemClick(this);
        this.$emit('click', this.value);
      }
    },
    /**
     * ================
     * 给根组件，和父组件添加值
     * ================
     * */
    created() {
      this.parentMenu.addItem(this);
      this.rootMenu.addItem(this);
    },
    beforeDestroy() {
      this.parentMenu.removeItem(this);
      this.rootMenu.removeItem(this);
    }
  };
</script>

<style lang="less">

</style>


