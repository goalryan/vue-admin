<template>
  <transition name="mask-fade">
    <div class="mask" v-if="show" @click="doOnClick" :style="styles"></div>
  </transition>
</template>

<script>
  export default {
    name: 'mask',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      bgColor: {
        type: String,
        default: '#000'
      },
      mOpacity: {
        type: Number,
        default: 0.4
      },
      zIndex: {
        type: Number,
        default: 9999
      },
      onClick: {
        type: Function
      }
    },
    computed: {
      styles() {
        return {
          'background-color': this.bgColor,
          'z-index': this.zIndex,
          opacity: this.mOpacity
        };
      }
    },
    methods: {
      doOnClick() {
        if (this.onClick) this.onClick();
      }
    }
  };
</script>

<style lang="less">
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: .4;
    z-index: 1000;
  }

  .mask-fade-enter-active,.mask-fade-leave-active {
    transition: opacity .45s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .mask-fade-enter,.mask-fade-leave-to {
    opacity: 0 !important;
  }
</style>
