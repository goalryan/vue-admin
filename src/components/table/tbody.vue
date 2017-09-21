<template>
  <tbody>
  <slot></slot>
  </tbody>
</template>

<script>
  export default {
    name: 'EcTbody',
    created() {
      this.isBody = true;
    }
  };
</script>
