<template>
  <button @click="handleClick"
          :type="nativeType"
          :class="['button',type ? 'button-' + type : '',{'is-disabled': loading}]">
    <i class="icon-left icon-loading" v-show="loading"></i>
    <slot></slot>
  </button>
</template>
<script>
  export default {
    name: 'EcButton',
    props: {
      type: {
        type: String,
        default: 'primary'
      },
      loading: {
        type: Boolean,
        default: false
      },
      nativeType: {
        type: String,
        default: 'button'
      }
    },
    methods: {
      handleClick(evt) {
        if (this.loading) return;
        this.$emit('click', evt);
      }
    }
  };
</script>
