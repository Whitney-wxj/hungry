<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay"
             :class="[this.totalPrice<this.minPrice?'not-enough':'enough']">{{payDesc}}
        </div>
      </div>
    </div>
    <!--小球-->
    <div class="ball-container">
      <!--{{beforeEnter()}}-->
      <transition-group name="drop"
                        @before-enter="beforeEnter"
                        @enter="enter"
                        @after-enter="afterEnter">
        <div v-for="(ball,index) in balls" v-bind:key="index" v-show="ball.show"
             class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!--购物车列表-->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!--弹出购物车列表之后的蒙版-->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
  </div>
</template>

<script>
  import Cartcontrol from '../cartcontrol/Cartcontrol.vue';
  import BScroll from 'better-scroll';
  export default{
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        show: false
      }
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {price: 10, count: 0}
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    created() {
      console.log(this.selectFoods);
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food => {
          total += food.price * food.count;
        }));
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() { //三种情况
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      listShow() {
        if (!this.totalCount) {
          return false;
        }
        if (this.show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return this.show;
      }
    },
    methods: {
//        小球下落状态改变。由cartcontrol的添加发送Addcart事件至Goods组件，再由Goods组件的addCart方法查找shopcart元素，触发这里drop事件
      drop(el){
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            console.log(this.dropBalls);
            return;
          }
        }
      },
      beforeEnter(el){
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            console.log(x, y);
            el.style.display = '';
//            el.style.transform = `translate(${x}px, ${y}px)`;
//            el.style.webKitTransform = `translate(0, ${y}px, 0)`;
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }

        }
      },
      enter(el){
        console.log("oooo");
        let rf = el.offsetHeight;
        //优化体验，异步执行下落动画
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el){
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      toggleList() {
        this.show = !this.show;
      },
      hideList(){
          this.show = false;
      }
    },
    components: {
      cartcontrol: Cartcontrol
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .shopcart {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 50;
    height: 48px;
    .content {
      display: flex;
      background: #141d27;
      color: rgba(255, 255, 255, 0.4);
      .content-left {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #2b343c;
            text-align: center;
            &.highlight {
              background: rgb(0, 160, 220);
            }
            .icon-shopping_cart {
              line-height: 44px;
              font-size: 24px;
              color: #80858a;
              &.highlight {
                color: #fff;
              }
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price {
          display: inline-block;
          vertical-align: top;
          line-height: 24px;
          margin-top: 12px;
          box-sizing: border-box;
          padding-right: 12px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          margin: 12px 0 0 12px;
          line-height: 24px;
          vertical-align: top;
          color: rgba(255, 255, 255, 0.4);
          font-size: 10px;
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        .pay {
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          background: #2b333b;
          &.not-enough {
            background: #2b333b;
          }
          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        &.drop-enter-active {
          transition: all 0.4s cubic-bezier(0.49, -0.19, 0.75, 0.41);
          /*opacity: 1;*/
          .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(0, 160, 220);
            transition: all 0.4s linear;
          }
        }
      }
    }
    .shopcart-list {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      background: #fff;
      transform: translate3d(0, -100%, 0);
      width: 100%;
      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.5s;
        transform: translate3d(0, -100%, 0)
      }
      &.fold-enter, &.fold-leave-to {
        transform: translate3d(0, 0, 0)
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          background: #fff;
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
    .list-mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      background: rgba(7, 17, 27, 0.6);
      &.fade-enter-active, &.fade-leave-active{  //必须写在fade-enter之前
        transition: all 0.5s;
        opacity: 1;
        background: rgba(7, 17, 27, 0.6);
      }
      &.fade-enter, &.fade-leave-to{
        background: rgba(7, 17, 27, 0);
        opacity: 0;
      }

    }
  }
</style>
