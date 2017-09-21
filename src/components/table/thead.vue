<template>
  <thead>
  <slot></slot>
  </thead>
</template>

<script>
  export default{
    name: 'EcThead',
    created() {
      this.isHead = true;
    }
  };
</script>
