<template>
  <div class="container-item" :style="itemStyle">
    <div class="item-head">
      <slot name="head"></slot>
    </div>
    <div class="item-body">
      <slot></slot>
    </div>
    <div class="item-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'EcContainerItem',
    props: {
      width: {
        type: String,
        default: ''
      }
    },
    computed: {
      itemStyle() {
        let s = { flex: 1 };
        if (this.width !== '') {
          s = { width: this.width };
        }
        return s;
      }
    }
  };
</script>
