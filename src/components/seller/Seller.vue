<template>
  <div class="seller" v-if="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span class="icon-favorite"  :class="{active: favoriteType}" @click="toggleFavorite()"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="supports" v-if="seller.supports">
          <li class="support-item" v-for="(item, index) in seller.supports">
            <span class="icon" :class="picMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Star from '../star/Star.vue';
  import BScroll from 'better-scroll';
  export default {
    data(){
      return {
        seller: null,
        favoriteType: false
      }
    },
    computed: {
      favoriteText(){
          return this.favoriteType ? '已收藏' : '收藏';
      }
    },
    components: {
      star: Star
    },
    created() {
      this.$http.get("/api/seller").then((res) => {
        this.seller = res.data.data;
        this.$nextTick(() => {
          this.initScroll();
          this.initPics();
        })
      });
      this.picMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      initScroll(){
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
              click: true
          });
        }
      },
      initPics() {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList.style.width = width + "px";
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true
            });
          } else {
            this.picScroll.refresh();
          }
      },
      toggleFavorite(){
       this.favoriteType = !this.favoriteType;
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .seller {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background: #f3f5f7;
    .overview {
      position: relative;
      padding: 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      background: #fff;
      margin-bottom: 16px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
        font-weight: 600;
      }
      .desc {
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          margin-right: 12px;
          line-height: 18px;
          font-size: 10px;
          color: rgb(77, 85, 93);
          vertical-align: top;
        }
      }
      .remark {
        display: flex;
        padding-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          &:last-child {
            border: none;
          }
          h2 {
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 4px;
            line-height: 10px;
          }
          .content {
            line-height: 24px;
            color: rgb(7, 17, 27);
            font-size: 10px;
            .stress {
              font-size: 24px;
            }
          }
        }
      }
      .favorite {
        position: absolute;
        right: 18px;
        top: 18px;
        text-align: center;
        .icon-favorite {
          display: block;
          font-size: 24px;
          color: #d4d6d9;
          line-height: 24px;
          margin-bottom: 4px;
          &.active {
            color: rgb(240, 20, 20);
          }
        }
        .text {
          font-size: 10px;
          color: rgb(77, 85, 93);
          line-height: 10px;
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      background: #fff;
      margin-bottom: 16px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
        font-weight: 600;
      }
      .content-wrapper {
        padding: 0 12px 16px 12px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .content {
          font-size: 12px;
          font-weight: 200;
          color: rgb(240, 20, 20);
          line-height: 24px;
        }
      }
      .supports {
        .support-item {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            background-size: 16px;
            vertical-align: top;
            &.decrease {
              background-image: url('decrease_4@2x.png');
            }
            &.discount {
              background-image: url('discount_4@2x.png');
            }
            &.guarantee {
              background-image: url('guarantee_4@2x.png');
            }
            &.invoice {
              background-image: url('invoice_4@2x.png');
            }
            &.special {
              background-image: url('special_4@2x.png');
            }
          }
          .text {
            font-size: 12px;
            font-weight: 200;
            color: rgb(7, 17, 27);
            line-height: 16px;
          }
        }
      }

    }
    .pics {
      background: #fff;
      margin-bottom: 16px;
      padding: 18px;
      padding-right: 0;
      .title {
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
        font-weight: 600;
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
          }
        }
      }
    }
    .info {
      background: #fff;
      margin-bottom: 16px;
      padding: 18px 18px 0 18px;
      color: rgb(7, 17, 27);
      .title {
        padding-bottom: 12px;
        line-height: 14px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 14px;
        font-weight: 600;
      }
      .info-item {
        padding: 16px 12px;
        line-height: 16px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 12px;
        &:last-child {
          border: none;
        }
      }
    }
  }
</style>
