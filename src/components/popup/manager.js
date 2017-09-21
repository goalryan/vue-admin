import Vue from 'vue';
import MaskLayout from './mask';
import { getDom } from './util';

const Mask = Vue.extend(MaskLayout);

const manager = {
  instances: [],
  timer: null,
  mask: false,
  /**
   * =======================
   * 当实例不存在或实例已经存在缓存中，直接返回，不作任何处理，否则执行下一步
   * 判断遮罩是否存在，不存在就创建遮罩，否则不创建遮罩，直接进行下一步
   * 将当前实例添加到缓存中
   * 更改当遮罩属性
   * ========================
   */
  show(instance) {
    if (!instance || this.instances.indexOf(instance) !== -1) return;
    if (!this.mask) {
      this.showMask(instance);
    } else {
      this.mask.show = true;
      clearTimeout(this.timer);
    }
    this.instances.push(instance);
    this.changeMask();
  },
  /**
   * =======================
   * 当前实例关掉，则从缓存中去除该实例
   * 如果缓存中已经没有实例存在，则将遮罩关闭掉
   * 如果还有实例存在，则更新遮罩属性
   * ========================
   */
  hide(instance) {
    const index = this.instances.indexOf(instance);
    if (index === -1) return;
    this.instances.splice(index, 1);
    if (this.instances.length === 0) {
      this.hideMask();
      return;
    }
    this.changeMask();
  },
  /**
   * =======================
   * 打开遮罩,将遮罩添加到当前打开弹框实例的同级
   * ========================
   */
  showMask(instance) {
    this.mask = new Mask({
      el: document.createElement('div')
    });
    this.mask.show = true;
    this.moveMask(instance);
  },
  /**
   * =======================
   * 关闭遮罩
   * ========================
   */
  hideMask() {
    if (!this.mask) return;
    this.mask.show = false;
    this.timer = setTimeout(() => {
      this.mask.$el.remove();
      this.mask.$destroy();
      this.mask = false;
    }, 450);
  },
  moveMask(instance) {
    const dom = getDom(instance.$el);
    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11 && !instance.modalAppendToBody) {
      dom.parentNode.appendChild(this.mask.$el);
    } else {
      document.body.appendChild(this.mask.$el);
    }
  },
  /**
   * =======================
   * 更新遮罩属性,
   * 如果还存在弹框实例，则将遮罩移到当前实例的同级节点去
   * ========================
   */
  changeMask() {
    if (!this.mask || this.instances.length === 0) return;
    const instance = this.instances[this.instances.length - 1];
    this.moveMask(instance);
    this.mask.bgColor = instance.maskBgColor;
    this.mask.mOpacity = instance.maskOpacity;
    this.mask.zIndex = instance.maskIndex;
  }
};

export default manager;
