<template>
  <div class="page-form">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'EcForm',
    props: {
      labelWidth: {
        type: String
      },
      inline: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="less">

</style>


