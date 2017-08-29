<template>
  <div class="header" v-if="seller">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class=""></i>
      </div>
    </div>

    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class=""></i>
    </div>

    <!--模糊背景-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>

    <!--详情弹层-->
    <transition name="fade">
     <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix"> <!--css sticker footers的固定套路-->
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :score="seller.score" :size="48"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <span class="icon-close"></span>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
  import star from '../star/Star';

  export default {
    data() {
      return {
        detailShow: false
      }
    },
    props: ["seller"],
    created() {
      //定义classMap用于icon背景切换
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    methods: {
      showDetail: function () {
        this.detailShow = true;
      },
      hideDetail: function () {
        this.detailShow = false;
      }
    },
    components: {
      star
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .header {
    color: #fff;
    /*background: #999;*/
    overflow: hidden; /*blur阴影底部不显示*/
    background: rgba(7, 17, 27, 0.5);
    position: relative;
    & .content-wrapper {
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0; /*为了去掉文字与图片之间的间隙*/
      & .avatar {
        display: inline-block;
        & img {
          border-radius: 2px;
        }
      }
      & .content {
        display: inline-block;
        font-size: 14px;
        margin-left: 16px;

        & .title {
          margin: 2px 0 8px 0;
          & .brand {
            display: inline-block;
            vertical-align: top;
            width: 30px;
            height: 18px;
            background: url(brand@2x.png);
            background-size: 30px 18px;
          }

          & .name {
            margin-left: 6px;
          }
        }

        & .description {
          margin-bottom: 10px;
          font-size: 12px;
          color: rgb(255, 255, 255);
          font-weight: 100;
          line-height: 12px;
        }

        & .support {
          & .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: top;
            /*background: url(decrease_1@2x.png); 背景从后端来*/
            background-size: 12px 12px;
            &.decrease {
              background-image: url('decrease_1@2x.png');
            }
            &.discount {
              background-image: url('discount_1@2x.png');
            }
            &.guarantee {
              background-image: url('guarantee_1@2x.png');
            }
            &.invoice {
              background-image: url('invoice_1@2x.png');
            }
            &.special {
              background-image: url('special_1@2x.png');
            }
          }
          & .text {
            font-size: 12px;
            line-height: 12px;
            vertical-align: top;
          }
        }
      }
      & .support-count {
        font-size: 12px;
        position: absolute;
        bottom: 18px;
        right: 12px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        /*color: #fff;*/
        background: rgba(0, 0, 0, 0.2);
      }
    }
    & .bulletin-wrapper {
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      background: rgba(7, 17, 27, 0.2);
      & .bulletin-title {
        display: inline-block;
        width: 22px;
        height: 12px;
        vertical-align: top;
        margin-top: 8px;
        background-image: url('bulletin@2x.png');
        background-repeat: no-repeat;
        background-size: 22px 12px;
      }
      & .bulletin-text {
        margin: 0 4px;
      }
    }
    & .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(10px);
    }
    & .detail {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(7, 17, 27, .8);
      &.fade-enter-active, &.fade-leave-active{
        transition: all 0.5s;
        left: 0;
        opacity: 1;
      }
      &.fade-enter, &.fade-leave-to{
        opacity: 0;
        left: 100%;
      }
      & .detail-wrapper {
        min-height: 100%;
        width: 100%; /*内容就居中了*/
        & .detail-main {
          margin-top: 64px;
          padding-bottom: 64px;
          & .name {
            line-height: 16px;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          & .star-wrapper{
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          & .title{
            display: flex;
            width: 80%;
            margin:28px auto 24px auto;
            & .line{
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, .2);
            }
            & .text{
              padding: 0 12px;
              font-size:  14px;
              font-weight: 700;
            }
          }
          & .supports{
            width: 80%;
            margin: 0 auto;
            & .support-item{
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              &:last-child{
                margin-bottom: 0;
              }
              & .icon{
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 6px;
                background-size:16px;
                vertical-align: top;
                &.decrease {
                  background-image: url('decrease_1@2x.png');
                }
                &.discount {
                  background-image: url('discount_1@2x.png');
                }
                &.guarantee {
                  background-image: url('guarantee_1@2x.png');
                }
                &.invoice {
                  background-image: url('invoice_1@2x.png');
                }
                &.special {
                  background-image: url('special_1@2x.png');
                }
              }
              & .text{
                line-height:16px;
                font-size: 12px;
              }
            }
          }
          & .bulletin{
            width: 80%;
            margin: 0 auto;
            & .content{
              padding: 0 12px;
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
      & .clearfix {
        display: inline-block;
        &:after {
          display: block;
          content: "";
          height: 0;
          line-height: 0;
          clear: both;
        }
      }
      & .detail-close {
        position: relative;
        width: 32px;
        height: 32px;
        color: #fff;
        font-size: 32px;
        margin: -50px auto 0 auto;
        clear: both;
      }
    }
  }
</style>
