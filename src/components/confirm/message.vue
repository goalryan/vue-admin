<template>
  <transition name="dialog-fade">
    <div class="dialog" v-show="show" >
      <div class="dialog-wrap dialog-message" >
        <div class="dialog-head">
          <span>{{title}}</span>
          <i v-if="showClose" class="icon-modal__close cursor" @click="handleClick('cancel')"></i>
        </div>
        <div class="dialog-message-content">
          <div class="dialog-message-icon">
            <i :class="typeClass"></i>
          </div>
          <div>{{message}}</div>
          <div class="sub-message">{{subMessage}}</div>
        </div>
        <div class="dialog-footer">
          <slot name="footer">
            <ec-button type="plain-default"
                       v-if="showCancelButton"
                       :loading="cancelButtonLoading"
                       :disabled="confirmButtonDisabled"
                       :class="[cancelButtonClass]"
                       @click="handleClick('cancel')">
              {{cancelButtonText}}
          </ec-button>
            <ec-button v-if="showConfirmButton"
                       :loading="confirmButtonLoading"
                       :disable="cancelButtonDisabled"
                       :class="[confirmButtonClass]"
                       @click="handleClick('confirm')">
              {{confirmButtonText}}
          </ec-button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import popMixin from '../popup';

  export default {
    mixins: [popMixin],
    data() {
      return {
        title: '提示',
        message: '',
        subMessage: '',
        type: '',
        action: '',
        customClass: '',
        showClose: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonDisabled: false,
        cancelButtonDisabled: false,
        confirmButtonClass: '',
        cancelButtonClass: '',
        beforeClose: null,
        callback: null
      };
    },
    computed: {
      typeClass() {
        return this.type && `icon-dialog_message__${this.type}`;
      }
    },
    methods: {
      handleClick(action) {
        this.action = action;
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(action, this, this.close);
        } else {
          this.close();
        }
      },
      close() {
        this.show = false;
        if (this.action && this.callback) {
          this.callback(this.action, this);
        }
      }
    }
  };
</script>


