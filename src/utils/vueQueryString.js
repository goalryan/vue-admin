/**
 * Created by lucas on 2017/8/3.
 */
export default function install(Vue, qs) {
  const VueQs = Vue;
  if (install.installed) {
    return;
  }
  install.installed = true;
  if (!qs) {
    console.error('You have to install qs');
    return;
  }

  VueQs.qs = qs;

  Object.defineProperties(VueQs.prototype, {
    $qs: {
      get() {
        return qs;
      }
    }
  });
}
