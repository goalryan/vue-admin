<template>
  <td :style="c">
    <slot></slot>
  </td>
</template>

<script>
  export default{
    name: 'EcTd',
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
