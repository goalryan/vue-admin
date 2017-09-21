<template>
  <transition name="page-fade">
    <div class="info-page" :style="index">
      <div class="page-wrapper">
        <div class="page-header">
          <div class="header-item"><i class="gray icon-return" @click="close"></i></div>
          <div class="header-item">
            <slot name="title">
              {{title}}
          </slot>
          </div>
          <div class="header-item"><i class="gray icon-innerpage__close" @click="close"></i></div>
        </div>
        <div class="page-body">
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
        <div class="page-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import PopupManager from 'element-ui/lib/utils/popup/popup-manager';

  export default {
    name: 'EcPage',
    props: {
      title: {
        type: String,
        default: '详情页'
      }
    },
    data() {
      return {
        index: {
          zIndex: PopupManager.nextZIndex()
        }
      };
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
</script>


