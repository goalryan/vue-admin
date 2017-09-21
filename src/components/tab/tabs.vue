<template>
  <div :class="[theme, width, {'gray':gray}]">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'EcTabs',
    props: {
      value: {},
      type: {
        type: String,
        default: 'bottom'
      },
      minWidth: {
        type: Boolean,
        default: false
      },
      gray: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      theme() {
        return `tab-${this.type}-wrapper`;
      },
      width() {
        let c = 'tab-flex-width';
        if (this.minWidth) {
          c = 'tab-min-width';
        }
        return c;
      }
    },
    methods: {
      handleTabClick(value) {
        if (this.value !== value) {
          this.$emit('change', value);
          this.$emit('update:value', value);
        }
      }
    }
  };
</script>

<style lang="less">

</style>


