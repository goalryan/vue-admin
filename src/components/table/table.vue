<template>
  <div class="ec-self-table" :class="{'strip':strip !== undefined,'hover':hover !== undefined}">
    <div>
      <table>
        <colgroup>
          <col>
          <col v-for="item in columns" :style="{width:item.width}">
        </colgroup>
        <slot v-if="fixedHead" name="head"></slot>
      </table>
    </div>
    <div :class="{'fixed':fixedHead}">
      <table :class="{'no-border':fixedHead}">
        <colgroup>
          <col>
          <col v-for="item in columns" :style="{width:item.width}">
        </colgroup>
        <slot v-if="!fixedHead" name="head"></slot>
        <slot></slot>
        <slot v-if="!fixedFoot" name="foot"></slot>
      </table>
    </div>
    <div>
      <table>
        <colgroup>
          <col>
          <col v-for="item in columns" :style="{width:item.width}">
        </colgroup>
        <slot v-if="fixedFoot" name="foot"></slot>
      </table>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'EcTable',
    props: {
      fixedHead: {
        type: Boolean,
        default: false
      },
      fixedFoot: {
        type: Boolean,
        default: false
      },
      strip: {
        type: String
      },
      hover: {
        type: String
      }
    },
    data() {
      return {
        selected: [],
        columns: [],
        isCheckAll: false
      };
    },
    computed: {
      trChildren() {
        return this.$children[1].$children;
      }
    },
    methods: {
      checkAll() {
        this.isCheckAll = !this.isCheckAll;
        this.trChildren.forEach((item) => {
          if (item.$options.name === 'EcTr') {
            if (this.isCheckAll) {
              item.isSelect = true;
              item.select();
            } else {
              item.isSelect = false;
              item.unSelect();
            }
          }
        });
      },
      getColumns() {
        let c = this.$children[0];
        while (c && c.$options.name !== 'EcTr') {
          c = c.$children[0];
        }
        c.$children.forEach((item) => {
          const param = {
            id: item.id,
            width: item.$el.width
          };
          this.columns.push(param);
        });
      }
    },
    mounted() {
      Vue.nextTick(
        this.getColumns
      );
    },
    watch: {
      selected: {
        handler() {
          let c = true;
          this.trChildren.forEach((item) => {
            if (item.$options.name === 'EcTr') {
              if (item.isSelect === false) {
                c = false;
              }
            }
          });
          this.isCheckAll = c;
          this.$emit('select-change', this.selected);
        },
        deep: true
      }
    }
  };
</script>
