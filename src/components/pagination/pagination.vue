<template>
  <ul class="pagination" v-if="pageList.length > 0">
    <li class="prev" :class="{disable: pageCurrent === 0}" @click="prev">
      <span> 上一页</span>
    </li>
    <li :class="{'active':0 === pageCurrent}" @click="setCurrentPage(0)">
      <span>1</span>
    </li>
    <p v-show="leftDot">
      <span>...</span>
    </p>
    <template v-for="item in pageList">
      <li v-if="item" :class="{'active':item-1 == pageCurrent}" @click="setCurrentPage(item-1)">
        <span>{{item}}</span>
      </li>
    </template>
    <p v-show="rightDot">
      <span>...</span>
    </p>
    <li :class="{'active':pageArea.max-1 == pageCurrent}" @click="setCurrentPage(pageArea.max-1)">
      <span>{{pageArea.max}}</span>
    </li>
    <li class="next" :class="{disable: pageCurrent == (pageArea.max-1)}" @click="next">
      <span>下一页 </span>
    </li>
    <div v-if="jumped" class="jump-wrap">
      <p class="jump-text">
        <solt v-if='total'>共{{total}}条</solt>
        到第
      </p>
      <input class="jump-num" type="number" min="1" v-model="searchPage">
      <p class="jump-text">页</p>
      <a class="btn large" href="javascript:;" @click="jump">确定</a>
    </div>
  </ul>
</template>

<script>
  /**
   * 翻页组件
   * @param {Number} totalPage - 总页数
   * @param {Number} total - 数据总条数
   * @param {Number} pageSize - 每页显示条数
   * @param {Boolean} jumped - 是否添加跳雷劈到指定页面功能
   * @param {Function} pageChange - 点击切换时触发的方法，父组件定义，该方法能接收到params参数
   */
  export default {
    name: 'EcPagination',
    props: {
      total: {
        type: Number,
        default: 0
      },
      totalPage: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 0
      },
      jumped: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 所要展示的页码列表
        pageList: [1],
        // 当前选中的页面
        pageCurrent: 1,
        // 页码的最大值与最小值
        pageArea: {
          min: 0,
          max: 0
        },
        // 指定跳转页时的数据
        searchPage: '',
        // 左右小略号的显示控制
        leftDot: false,
        rightDot: false
      };
    },
    mounted() {
      this.initPageList();
    },
    watch: {
      totalPage: {
        handler(val) {
          this.initPageList();
          if (val <= 0) {
            this.leftDot = false;
            this.rightDot = false;
          }
        },
        deep: true
      }
    },
    methods: {
      /**
       * 初始化菜单列表
       * 根据传入的 total 和 pageSize 向上取整计算出最大页数 pageArea.max
       */
      initPageList() {
        if (this.totalPage >= 0) {
          this.pageArea.max = this.totalPage;
        }
        this.pageCurrent = 0;
        this.pageListRefresh();
      },
      /**
       * 设置当前页数
       * @param {Number} pageNumber
       */
      setCurrentPage(pageNumber) {
        this.pageCurrent = pageNumber;
        this.pageListRefresh();
        this.changePage();
      },
      /**
       * 跳转到指定页面
       */
      jump() {
        if (!this.searchPage.trim() === '' && this.searchPage.trim() <= this.pageArea.max) {
          this.pageCurrent = Number(this.searchPage) - 1;
          this.pageListRefresh();
          this.changePage();
        }
      },

      /**
       * 获取上一页
       */
      prev() {
        if (this.pageCurrent === 0) {
          return false;
        }
        if (this.pageCurrent > this.pageArea.min) {
          this.pageCurrent -= 1;
        } else {
          this.pageCurrent = 0;
        }
        this.pageListRefresh();
        this.changePage();
        return false;
      },
      /**
       * 获取下一页
       */
      next() {
        if (this.pageCurrent === this.pageArea.max - 1) {
          return false;
        }
        if (this.pageCurrent < this.pageArea.max - 1) {
          this.pageCurrent += 1;
        } else {
          this.pageCurrent = this.pageArea.max - 1;
        }
        this.pageListRefresh();
        this.changePage();
        return false;
      },
      /**
       * 刷新需要显示的页码
       */
      pageListRefresh() {
        const arr = [];
        /**
         * 默认有第一页，和最后一页
         * 循环的数组当中不添加第一项和最后一项
         */
        for (let i = 2; i <= this.pageArea.max - 1; i += 1) {
          arr.push(i);
        }
        /**
         * 当最大页数为2时
         * 则只已有的第一页，最后一页
         */
        if (this.pageArea.max === 2) {
          arr.length = 1;
          this.pageList = arr;
          return;
        }
        /**
         * 当最大页小于10时
         * 显示所有页码
         */
        if (this.pageArea.max < 10) {
          this.pageList = arr.slice(0, this.pageArea.max);
          return;
        }
        /**
         * 当最大页数大于等于10时，则部分显示
         * 1.当前页数小于5时，显示前五个，以及右省略号
         * 2.当前页数及最大页数的差小于5时，显示后五个，以及左省略号
         * 3.当前页数处于中间时，显示当前页前后两页，同时左右略号均显示
         */
        if (this.pageCurrent < 6) {
          this.pageList = arr.slice(0, 6);
          this.rightDot = true;
          this.leftDot = false;
        } else if (this.pageArea.max - this.pageCurrent < 6) {
          this.pageList = arr.slice(-6);
          this.leftDot = true;
          this.rightDot = false;
        } else {
          const start = this.pageCurrent - 3;
          this.pageList = arr.slice(start, start + 5);
          this.leftDot = true;
          this.rightDot = true;
        }
      },
      /**
       * 触发父组件的pageChange事件
       */
      changePage() {
        this.$emit('page-change', this.pageCurrent);
      }
    }
  };
</script>

<style lang="less">

</style>


