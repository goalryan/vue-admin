<template>
  <transition name="dialog-fade">
    <div class="dialog" v-show="show">
      <div class="dialog-wrap" :style="dialogCustomer">
        <div class="dialog-head">
          <span>{{title}}</span>
          <i v-if="showClose" class="icon-modal__close cursor" @click="close"></i>
        </div>
        <slot></slot>
        <div class="dialog-footer" v-if="showCancelButton || showConfirmButton">
          <slot name="footer">
            <ec-button v-if="showCancelButton" :loading="cancelLoading" type="plain-default" @click="cancel">取消</ec-button>
            <ec-button v-if="showConfirmButton" :loading="confirmLoading" @click="confirm">确定</ec-button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import popMixin from '../popup';

  export default {
    name: 'EcDialog',
    mixins: [popMixin],
    props: {
      title: {
        type: String,
        default: '提示'
      },
      showClose: {
        type: Boolean,
        default: true
      },
      showCancelButton: {
        type: Boolean,
        default: true
      },
      showConfirmButton: {
        type: Boolean,
        default: true
      },
      confirmLoading: {
        type: Boolean,
        default: false
      },
      cancelLoading: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: 'auto'
      }
    },
    computed: {
      dialogCustomer() {
        return {
          width: this.width
        };
      }
    },
    methods: {
      close() {
        this.doClose();
        this.$emit('close');
      },
      cancel() {
        this.doClose();
        this.$emit('cancel');
      },
      confirm() {
        this.$emit('confirm');
      }
    }
  };
</script>

