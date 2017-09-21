<template>
    <div class="no-data">
      <div class="no-img">
        <slot>
          <img :src="noImg" alt="">
        </slot>
      </div>
      <div class="no-text">{{text}}</div>
    </div>
</template>

<script>
  import noImg from '../../assets/images/noData.png';

  export default {
    name: 'EcNoData',
    data() {
      return {
        noImg
      };
    },
    props: {
      text: {
        type: String,
        default: '暂无数据'
      }
    }
  };
</script>


