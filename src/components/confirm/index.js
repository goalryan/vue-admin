import Vue from 'vue';
import msg from './message';

const MsgConstructor = Vue.extend(msg);
const MsgQuen = [];
let currentMsg;
let instance;
const defaultConfig = {
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

const merge = (target, ...args) => {
  for (let i = 0, j = args.length; i < j; i += 1) {
    const source = args[i] || {};
    Object.keys(source).forEach((key) => {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
  }
  return target;
};

const defaultCallback = (action) => {
  if (currentMsg) {
    const cb = currentMsg.callback;
    if (typeof cb === 'function') {
      cb(action);
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        currentMsg.resolve(action);
      } else if (action === 'cancel' && currentMsg.reject) {
        currentMsg.reject(action);
      }
    }
  }
};

const InitInstance = () => {
  instance = new MsgConstructor({
    el: document.createElement('div')
  });
  instance.callback = defaultCallback;
};
/**
 * 1、判断实例存不存在，不存在，则创建，存在，则将action的值赋为空
 * 2、将options的值赋给当前实例
 * 3、如果options.callback不存在，则将默认的callback赋给它
 * 4、将实例添加到dom节点中，dom更新后，设置显示
 * 5、callback会在弹出窗口的确认，取消按钮被点击时触发
 * */
const showMessage = () => {
  if (!instance) {
    InitInstance();
  }
  instance.action = '';
  if (!instance.show) {
    if (MsgQuen.length > 0) {
      currentMsg = MsgQuen.shift();
      const options = currentMsg.options;
      Object.keys(options).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          instance[key] = options[key];
        }
      });
      if (options.callback === undefined || options.callback === null) {
        instance.callback = defaultCallback;
      }
    }
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.show = true;
    });
  }
};

/**
 * 1、通过传参的方式不同，给赋不同的值
 *    当第一个参数为字符串时，则依次默认为：提示消息，类型，标题
 * 2、当options.callback存在，且传入的参数中没有callback时，则将options.callback 给到callback
 *    如果参数callback存在，则默认参数中的callback优先级最高
 * 3、当前浏览器支持promise，返回一个promise对象，接收resolve,reject两个函数
 * */
const Message = (options, callback, ...args) => {
  if (typeof options === 'string') {
    options = {
      message: options
    };
    if (typeof callback === 'string') {
      options.type = callback;
    }
    if (args.length > 0 && typeof args[0] === 'string') {
      options.title = args[0];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }
  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      MsgQuen.push({
        options: merge({}, defaultConfig, options),
        callback,
        resolve,
        reject
      });
      showMessage();
    });
  }
  MsgQuen.push({
    options,
    callback
  });
  showMessage();
  return true;
};

export default Message;
