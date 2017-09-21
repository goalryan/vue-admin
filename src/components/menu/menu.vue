<template>
      <ul class="menu">
        <template v-if="data.length > 0">
          <slot></slot>
        </template>
        <template v-else>
          <ec-no-data></ec-no-data>
        </template>
      </ul>
</template>

<script>
  export default {
    name: 'EcMenu',
    props: {
      active: {
        default: ''
      },
      openeds: {
        type: Array,
        default() {
          return [];
        }
      },
      uniqueOpened: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default() {
          return [1];
        }
      }
    },
    data() {
      return {
        openedMenus: this.openeds,
        items: {},
        submenus: []
      };
    },
    watch: {
      openedMenus: {
        handler(val) {
          this.$emit('update:openeds', val);
        },
        deep: true
      },
      openeds: {
        handler(val) {
          this.openedMenus = val;
        },
        deep: true
      }
    },
    mounted() {
      this.initOpenedMenu();
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
       * 打开菜单
       * ================
       * */
      openMenu(index, indexPath) {
        const openedMenus = this.openedMenus;
        // 已经打开，不作任何操作
        if (openedMenus.indexOf(index) !== -1) return;
        // 将不在该菜单路径下的其余菜单收起
        if (this.uniqueOpened) {
          this.openedMenus = openedMenus.filter(
              keyIndex => indexPath.indexOf(keyIndex) !== -1
          );
        }
        this.openedMenus.push(index);
      },
      /**
       * ================
       * 关闭某个子菜单
       * ================
       * */
      closeMenu(index) {
        this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
      },
      /**
       * ================
       * 处理有子级菜单的点击事件
       * ================
       * */
      handleSubmenuClick(submenu) {
        const { index, indexPath } = submenu;
        const isOpened = this.openedMenus.indexOf(index) !== -1;
        this.syncIndex(submenu.index);
        if (isOpened) {
          this.closeMenu(index, indexPath);
          this.$emit('close', index, indexPath);
        } else {
          this.openMenu(index, indexPath);
          this.$emit('open', index, indexPath);
        }
        this.$emit('select', submenu.value, index, indexPath, submenu);
      },
      /**
       * ================
       * 处理末级菜单的点击事件
       * ================
       * */
      handleItemClick(item) {
        const { index, indexPath } = item;
        this.syncIndex(item.index);
        this.$emit('select', item.value, index, indexPath, item);
      },
      /**
       *  ================
       *  初始化需要打开的菜单
       *  ================
       * */
      initOpenedMenu() {
        const index = this.active;
        const activeItem = this.items[index];
        if (!activeItem) return;

        const indexPath = activeItem.indexPath;

        // 展开该菜单路径上的子菜单
        indexPath.forEach((keyIndex) => {
          const submenu = this.submenus[keyIndex];
          if (submenu) {
            this.openMenu(keyIndex, submenu.indexPath);
          }
        });
      },
      syncIndex(val) {
        this.$emit('update:active', val);
      }
    }
  };
</script>

<style lang="less">

</style>


