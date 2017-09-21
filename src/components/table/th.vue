<template>
  <th :style="c">
    <slot></slot>
  </th>
</template>

<script>
  export default {
    name: 'EcTh',
    props: {
      align: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      c() {
        return { 'text-align': this.align };
      }
    }
  };
</script>
