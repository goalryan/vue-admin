<template>
  <li :key="index">
    <div class="sub-title"
         :class="{'is-active':active, 'is-line-active':lineActive}"
         :style="paddingStyle"
         @click.stop="handleClick">
      <i  :class="['icon-margin-right','icon-arrow__right',{'opened':opened},{'icon-transparent':!haveChildren}]"></i>
      <slot name="title"></slot>
    </div>
    <ul class="menu" v-show="opened">
      <slot></slot>
    </ul>
  </li>
</template>

<script>
  import menuMix from './mixin';

  export default {
    mixins: [menuMix],
    name: 'EcSubmenu',
    props: {
      haveChildren: {
        type: Boolean,
        default: true
      },
      index: {
        type: [String, Number],
        require: true
      },
      value: ''
    },
    data() {
      return {
        items: {},
        submenus: {}
      };
    },
    computed: {
      /**
       * ================
       * 计算当前是否打开
       * ================
       * */
      opened() {
        return this.rootMenu.openedMenus.indexOf(this.index) > -1;
      },
      active() {
        return this.index === this.rootMenu.active;
      },
      /**
       * ================
       * 当前项是否被选中,当子项其中有一项active，则该菜单active
       * ================
       * */
      lineActive: {
        cache: false,
        get() {
          let isActive = false;
          Object.keys(this.items).forEach((key) => {
            if (this.items[key].active) {
              isActive = true;
            }
          });
          Object.keys(this.submenus).forEach((key) => {
            if (this.submenus[key].lineActive || this.submenus[key].active) {
              isActive = true;
            }
          });
          return isActive;
        }
      }
    },
    methods: {
      addItem(item) {
        this.$set(this.items, item.index, item);
      },
      removeItem(item) {
        delete this.items[item.index];
      },
      addSubmenu(item) {
        this.$set(this.submenus, item.index, item);
      },
      removeSubmenu(item) {
        delete this.submenus[item.index];
      },
      /**
       * ================
       * 点击事件
       * ================
       * */
      handleClick() {
        this.rootMenu.handleSubmenuClick(this);
        this.$emit('click', this.value);
      }
    },
    /**
     * ================
     * 给根组件，和父组件添加值
     * ================
     * */
    created() {
      this.parentMenu.addSubmenu(this);
      this.rootMenu.addSubmenu(this);
    },
    beforeDestroy() {
      this.parentMenu.removeSubmenu(this);
      this.rootMenu.removeSubmenu(this);
    }
  };
</script>

<style lang="less">

</style>


