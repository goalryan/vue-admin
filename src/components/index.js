/**
 * Created by lucas on 2017/7/27.
 */
import EcHeader from './frame/header';
import EcContainer from './frame/container';
import EcSideBar from './frame/sideBar';
import EcContainerItem from './frame/containerItem';
import { EcPage, EcPageItem } from './page';
import EcButton from './button';
import EcText from './text';
import EcCrystalButton from './crystalButton';
import EcDialog from './dialog';
// import { EcTab, EcTabs } from './tab';
// import { EcMenu, EcSubmenu, EcMenuItem } from './menu';
// import EcSideMenu from './sideMenu';
// import EcPagination from './pagination';
// import { EcForm, EcFormItem } from './form';
// import confirm from './confirm';
import EcUpload from './upload';
// import EcPreviewImage from './previewImage';
// import EcOperateMenu from './operateMenu';
// import EcNumber from './number';
// import EcRichEditor from './richEditor';
// import EcNoData from './noData';
// import { EcTable, EcTbody, EcThead, EcTh, EcTr, EcTd } from './table';

const components = {
    EcHeader,
    EcContainer,
    EcSideBar,
    EcContainerItem,
    EcPage,
    EcPageItem,
    EcButton,
    EcText,
    EcCrystalButton,
    EcDialog,
    // EcTab,
    // EcTabs,
    // EcMenu,
    // EcSubmenu,
    // EcMenuItem,
    // EcSideMenu,
    // EcPagination,
    // EcForm,
    // EcFormItem,
    EcUpload,
    // EcPreviewImage,
    // EcOperateMenu,
    // EcNumber,
    // EcRichEditor,
    // EcNoData,
    // EcTable,
    // EcTbody,
    // EcThead,
    // EcTh,
    // EcTr,
    // EcTd
};

const install = (Vue) => {
    Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key]);
    });
    Vue.prototype.$ecConfirm = confirm;
};

export default { install };

