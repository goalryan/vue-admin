<template>
  <button @click="handleClick"
          :type="nativeType"
          :class="['crystal-button',type ? 'crystal-button-' + type : '']">
    <slot></slot>
  </button>
</template>
<script>
  export default {
    name: 'EcCrystalButton',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      nativeType: {
        type: String,
        default: 'button'
      }
    },
    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
