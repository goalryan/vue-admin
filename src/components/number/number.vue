<template>
  <div class="el-input" :class="{'el-input-group': this.$slots.append , 'el-input-group--append':this.$slots.append}">
    <input ref="input" type="text"
           class="el-input__inner"
           :class="{'danger':danger}"
           @blur="handleBlur"
           @focus="handleFocus"
           :placeholder="placeholder"
           :disabled="disabled"
           :readonly="readonly"
           v-model="inputValue"
           :maxlength="maxLength">
    <div v-if="this.$slots.append" class="el-input-group__append">
      <slot name="append">
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EcNumber',
    props: {
      value: '',
      maxlength: {
        default: 16
      },
      decimal: {
        default: 2
      },
      placeholder: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      danger: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleBlur(e) {
        this.$emit('blur', e);
      },
      handleFocus(e) {
        this.$emit('focus', e);
      }
    },
    computed: {
      maxLength() {
        let length = parseInt(this.maxlength, 10) + parseInt(this.decimal, 10) + 1;
        if (this.decimal === 0) {
          length = parseInt(this.maxlength, 10);
        }
        return length;
      },
      inputValue: {
        get() {
          return this.value;
        },
        set(val) {
          if (val === undefined || val === null) return;
          let newVal = val;
          /**
           * ===================
           * 根据是否设置有小数位数,来生成对应的格式校验正则表达式
           * ===================
           * */
          const symbolRule = /[^\d.]/g;
          let formatRule = new RegExp(`^\\d{1,${this.maxlength}}(\\.{1,1}\\d{0,${this.decimal})?$`);
          if (this.decimal === 0) {
            formatRule = new RegExp(`^\\d{1,${this.maxlength}}$`);
          }
          /**
           * ===================
           * 当检测到有除小数点【.】特殊字符的时候，会将特殊字符替换掉
           * ===================
           * */
          if (symbolRule.test(val)) {
            newVal = val.replace(symbolRule, '');
            this.$refs.input.value = newVal;
          }
          /**
           * ===================
           * 如果格式正确，则直接返回
           * 如果格式不正确，则进行修正
           * ===================
           * */
          if (formatRule.test(newVal)) {
            this.$emit('input', newVal);
            this.$refs.input.value = newVal;
            return;
          }
          /**
           * ===================
           * 当有小数时，重新整合数字
           * ===================
           * */
          const index = newVal.indexOf('.');
          if (index > 0) {
            const parts = newVal.split('.');
            const partInteger = parts[0].slice(0, this.maxlength);
            const partDecimal = `.${parts[1].slice(0, this.decimal)}`;
            if (this.decimal > 0) {
              newVal = partInteger + partDecimal;
            } else {
              newVal = partInteger;
            }
            /**
             * ===================
             * 当只有小数点时，将值设为空
             * ===================
             * */
          } else if (index === 0) {
            newVal = '';
            /**
             * ===================
             * 当没有小数时，截取最大长度的数字
             * ===================
             * */
          } else {
            newVal = newVal.slice(0, this.maxlength);
          }
          this.$emit('input', newVal);
          this.$refs.input.value = newVal;
        }
      }
    }
  };
</script>


