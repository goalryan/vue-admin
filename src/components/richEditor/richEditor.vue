<template>
  <div :id="id"></div>
</template>

<script>
  import tinymce from 'tinymce';
  import 'tinymce/themes/modern/theme';
  import 'tinymce/skins/lightgray/skin.min.css';
  import 'tinymce/skins/lightgray/content.min.css';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/charmap';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/textcolor';
  import 'tinymce/plugins/colorpicker';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/anchor';
  import './zh_CN';


  export default {
    name: 'EcRichEditor',
    data() {
      return {
        hasChange: false,
        hasInit: false
      };
    },
    props: {
      id: {
        type: String,
        default: 'tinymceEditor'
      },
      value: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: 'ierp/v1/file/upload'
      },
      height: {
        type: Number,
        required: false,
        default: 400
      },
      toolbar: {
        type: Array,
        default() {
          return ['undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect | forecolor backcolor | bullist numlist | outdent indent | removeformat | link unlink uploadimage'];
        }
      },
      config: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    mounted() {
      tinymce.PluginManager.add('uploadimage', (editor) => {
        function selectLocalImages() {
          const dom = editor.dom;
          const F = document.createElement('input');
          F.setAttribute('type', 'file');
          F.setAttribute('name', 'thumbnail');
          F.setAttribute('accept', 'image/jpg,image/jpeg,image/png,image/gif');
          F.setAttribute('multiple', 'multiple');

          F.addEventListener('change', (e) => {
            const formData = new FormData();
            const xhr = new XMLHttpRequest();
            formData.append('file', e.target.files[0]);
            xhr.open('POST', editor.settings.upload_image_url);
            xhr.send(formData);
            xhr.onload = () => {
              if (xhr.status === 200 || xhr.status === 304) {
                editor.focus();
                editor.selection.setContent(dom.createHTML('img',
                  { src: JSON.parse(xhr.responseText).data.url }));
              }
            };
            xhr.onerror = (err) => {
              console.log(err);
            };
          });

          F.click();
        }

        editor.addCommand('mceUploadImageEditor', selectLocalImages);

        editor.addButton('uploadimage', {
          icon: 'image',
          tooltip: '上传图片',
          onclick: selectLocalImages
        });

        editor.addMenuItem('uploadimage', {
          icon: 'image',
          text: '上传图片',
          context: 'tools',
          onclick: selectLocalImages
        });
      });
      tinymce.init(Object.assign(this.config, {
        selector: `#${this.id}`,
        skin: false,
        // 可以设置编辑器id
        height: this.height,
        language: 'zh_CN',
        menubar: '',
        // 上传图片地址
        upload_image_url: this.url,
        // 链接在新窗口打开
        default_link_target: '_blank',
        // 插件
        plugins: [
          'advlist autolink autosave lists link image charmap print preview anchor',
          'textcolor colorpicker textpattern code uploadimage',
          'paste'
        ],
        // 工具件
        toolbar: this.toolbar,
        // 设置选择的字体及字体大小
        fontsize_formats: '12px 14px 16px 18px 24px 36px 72px',
        font_formats: "微软雅黑MicrosoftYaHei='Microsoft YaHei';宋体SimSun='SimSun';黑体SimHei='SimHei';仿宋FangSong='FangSong';楷体KaiTi='KaiTi';隶书LiSu='LiSu';幼圆YouYuan='YouYuan'",
        // 粘贴时的相关配置，去掉格式等
        paste_as_text: true,
        paste_auto_cleanup_on_paste: true,
        paste_remove_spans: true,
        paste_remove_styles: true,
        paste_retain_style_properties: false,
        setup: (editor) => {
          editor.on('NodeChange Change keyup', () => {
            this.$emit('input', editor.getContent({ format: 'raw' }));
            this.$emit('change', editor.getContent({ format: 'raw' }));
          });
          editor.on('init', () => {
            editor.setContent(this.value);
            this.$emit('input', editor.getContent({ format: 'raw' }));
            this.$emit('change', editor.getContent({ format: 'raw' }));
          });
        }
      }));
    },
    beforeDestroy() {
      tinymce.remove();
    }
  };
</script>


