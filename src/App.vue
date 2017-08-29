<template>
  <div id="app">
    <my-header :seller="seller"></my-header>
    <div class="tabs">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <transition name="slide">
      <router-view :seller="seller" class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
  import Header from './components/header/Header.vue';

  export default {
    name: 'app',
    data() {
      return {
        seller: null
      }
    },
    components: {
      myHeader: Header
    },
    created() {
      this.$http.get("/api/seller").then((res) => {
        this.seller = res.data.data;
      });
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .tabs {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    & .tab-item {
      flex: 1;
      text-align: center;

      & a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);

        &.router-link-active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
  .router-view {
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.5s;
      opacity: 1;
    }
    &.slide-enter, &.slide-leave-to {
      opacity: 0;
    }
  }
</style>
