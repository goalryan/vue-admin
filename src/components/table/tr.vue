<template>
  <tr>
    <th v-if="isHeadChild">
      <input type="checkbox" :checked="isCheckAll" @change="checkAll">
    </th>
    <td v-if="isBodyChild">
      <input type="checkbox" :checked="isSelect" @change="check">
    </td>
    <slot></slot>
  </tr>
</template>

<script>
  export default{
    name: 'EcTr',
    props: {
      value: ''
    },
    data() {
      return {
        isSelect: false
      };
    },
    computed: {
      rootTable() {
        let parent = this.$parent;
        while (parent && parent.$options.name !== 'EcTable') {
          parent = parent.$parent;
        }
        return parent;
      },
      selected() {
        return this.rootTable.selected;
      },
      isCheckAll() {
        return this.rootTable.isCheckAll;
      },
      isHeadChild() {
        return this.$parent.isHead === true;
      },
      isBodyChild() {
        return this.$parent.isBody === true;
      }
    },
    methods: {
      checkAll() {
        this.rootTable.checkAll();
      },
      check() {
        this.isSelect = !this.isSelect;
        if (this.isSelect) {
          this.select();
        } else {
          this.unSelect();
        }
      },
      select() {
        this.rootTable.selected.push(this.value);
      },
      unSelect() {
        this.rootTable.selected.splice(this.rootTable.selected.indexOf(this.value), 1);
      }
    }
  };
</script>
