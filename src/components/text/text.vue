<template>
  <a href="javascript:;"
     @click="handleClick"
     :class="['text-button',type ? 'text-button-' + type : '',{'is-disabled': disabled}]">
     <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'EcText',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClick(evt) {
        if (this.disabled) return;
        this.$emit('click', evt);
      }
    }
  };
</script>

<style lang="less">

</style>


