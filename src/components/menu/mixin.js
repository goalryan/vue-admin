/**
 * Created by Skye on 2017/8/4.
 */
export default {
  computed: {
    /**
    * =========
    * 获取从子级到父级一条线的index数组
    * =========
    * */
    indexPath() {
      const path = [this.index];
      let parent = this.$parent;
      while (parent.$options.name !== 'EcMenu') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    /**
     * =========
     * 获取根菜单组件
     * =========
     * */
    rootMenu() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== 'EcMenu') {
        parent = parent.$parent;
      }
      return parent;
    },
    /**
     * =========
     * 获取父级菜单组件
     * =========
     * */
    parentMenu() {
      let parent = this.$parent;
      while (parent && ['EcMenu', 'EcSubmenu'].indexOf(parent.$options.name) === -1) {
        parent = parent.$parent;
      }
      return parent;
    },
    /**
     * =========
     * 根据层级计算左内边距
     * =========
     * */
    paddingStyle() {
      let padding = 20;
      let parent = this.$parent;
      while (parent && parent.$options.name !== 'EcMenu') {
        if (parent.$options.name === 'EcSubmenu') {
          padding += 20;
        }
        parent = parent.$parent;
      }
      return { paddingLeft: `${padding}px` };
    }
  }
};
