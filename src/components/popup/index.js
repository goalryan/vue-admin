import PopupManager from 'element-ui/lib/utils/popup/popup-manager';
import Manager from './manager';
// 和elementUI的层级数据保持一致
// import { getIndex } from './utils';

export default {
  props: {
    show: {
      type: Boolean,
      require: true
    },
    maskBgColor: {
      type: String,
      default: '#000'
    },
    maskOpacity: {
      type: Number,
      default: 0.4
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maskIndex: PopupManager.nextZIndex(),
      zIndex: PopupManager.nextZIndex()
    };
  },
  updated() {
    this.setIndex();
  },
  mounted() {
    if (this.show) {
      Manager.show(this);
    }
  },
  methods: {
    setIndex() {
      const dom = this.$el;
      if (dom) dom.style.zIndex = this.zIndex;
    },
    resetIndex() {
      this.maskIndex = PopupManager.nextZIndex();
      this.zIndex = PopupManager.nextZIndex();
    },
    doClose() {
      this.$emit('update:show', false);
    }
  },
  watch: {
    show(val, oldval) {
      if (val === oldval) return;
      if (val) {
        this.resetIndex();
        Manager.show(this);
      } else {
        Manager.hide(this);
      }
    }
  }
};
