<template>
  <transition name="preview-fade">
    <div @click.stop="close" v-show="show" class="preview-wrap">
      <div class="img-wrap">
        <div class="pre">
          <div class="arrow" @click.stop="pre">
            <i class="icon-arrow__left img-icon"></i>
          </div>
        </div>
        <div ref="imgWrap" class="img-content">
          <div class="img-area">
            <div class="arrow close" @click.stop="close">
              <i class="icon-innerpage__close img-icon"></i>
            </div>
            <img ref="img" @click.stop="" class="img">
          </div>
          <div class="img-loading" v-show="showLoading">
            <i class="icon-loading"></i>
          </div>
        </div>
        <div class="next">
          <div class="arrow" @click.stop="next">
            <i class="icon-arrow__right img-icon"></i>
          </div>
        </div>
      </div>
      <div v-if="this.$slots.default" class="down" @click.stop="" >
        <slot>
          <ec-button type="plain-default"><i class="icon-download icon-left"></i>下载</ec-button>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
  import popMixin from '../popup';

  export default {
    name: 'EcPreviewImage',
    mixins: [popMixin],
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
        require: true
      },
      show: {
        type: Boolean,
        default: false,
        require: true
      },
      index: {
        type: Number,
        default: 0,
        require: true
      }
    },
    data() {
      return {
        showLoading: false
      };
    },
    computed: {
      currentIndex: {
        get() {
          return this.index;
        },
        set(val) {
          this.$emit('update:index', val);
        }
      },
      currentImgObj() {
        return this.data[this.currentIndex];
      }
    },
    methods: {
      pre() {
        if (this.showLoading) return;
        if (this.currentIndex === 0) {
          this.currentIndex = this.data.length - 1;
        } else {
          this.currentIndex -= 1;
        }
      },
      next() {
        if (this.showLoading) return;
        if (this.currentIndex === this.data.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex += 1;
        }
      },
      close() {
        this.doClose();
        this.$emit('close');
      },
      /**
       * ============
       * 根据原文件宽高，与展示窗口的宽高比，重新确定图片展示的宽高值
       * ============
       * */
      autoSize() {
        this.showLoading = true;
        const image = new Image();
        const imgContent = this.$refs.imgWrap;
        const img = this.$refs.img;
        const cw = imgContent.clientWidth;
        const ch = imgContent.clientHeight;
        image.src = this.currentImgObj.url || this.currentImgObj.downloadUrl;
        image.onload = () => {
          const iw = image.width;
          const ih = image.height;
          if (iw < cw && ih < ch) {
            img.style.width = `${iw}px`;
            img.style.height = `${ih}px`;
          } else if (iw / ih >= cw / ch) {
            img.style.width = `${cw}px`;
            img.style.height = `${cw * (ih / iw)}px`;
          } else {
            img.style.width = `${ch * (iw / ih)}px`;
            img.style.height = `${ch}px`;
          }
          img.src = this.currentImgObj.url || this.currentImgObj.downloadUrl;
          this.showLoading = false;
        };
      }
    },
    watch: {
      currentIndex() {
        this.autoSize();
      },
      show(val) {
        if (val) {
          this.$nextTick(() => {
            this.autoSize();
          });
        }
      }
    }
  };
</script>


