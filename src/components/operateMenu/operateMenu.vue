<template>
    <div class="operate-menu">
      <div v-if='config.length > 0' class='leftArr'>
        <span class="arr-text" @click='handleClick(config[0],0)'>
            <i :class="['icon-left',config[0].icon]"></i>{{config[0].name}}
        </span>
        <span class="arrow-wrap" @click.stop='switchMenu'>
            <span class="arrow-close"></span>
        </span>
      </div>
      <div class='select-option' v-if='openSelect'>
        <a href="javascript:;" @click='handleClick(item,$index)' v-for='(item,$index) in config'>
          <span class="arr-text"><i :class="['icon-left',item.icon]"></i>{{item.name}}</span>
          <span v-if='$index === 0' @click.stop="switchMenu" class="arrow"></span>
        </a>
      </div>
    </div>
</template>

<script>
  /**
   * config:[{
   *    name: '新增',
   *    type: 'add',
   *    icon: 'icon-hp_list__add'
   *  }]
   */
  export default {
    name: 'EcOperateMenu',
    props: {
      config: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    created() {
      window.addEventListener('click', () => {
        this.openSelect = false;
      });
    },
    data() {
      return {
        openSelect: false
      };
    },
    methods: {
      handleClick(item, index) {
        this.$emit('click', item.type, index, item);
      },
      switchMenu() {
        this.openSelect = !this.openSelect;
      }
    }
  };
</script>

<style lang="less">

</style>


