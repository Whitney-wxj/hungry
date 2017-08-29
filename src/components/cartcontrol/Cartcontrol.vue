<template>
  <div class="cartcontrol">
    <transition name="fade">
    <div class="cart-decrease icon-remove_circle_outline"
         v-show="food.count>0" @click.stop="decreaseCart">
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add  icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
      //console.log(this.food);
    },
    methods: {
      addCart(event) {
        if (!this.food.count) {
            Vue.set(this.food, "count", 1); //设置默认值 的话。vue观测不到count的变化
//          this.food.count = 1;
        } else {
          this.food.count++;
        }
        //
        this.$emit('cartAdd', event.target);
      },
      decreaseCart() {
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .cartcontrol {
    font-size: 0;
    .cart-decrease, .cart-add {
      display: inline-block;
      padding: 6px; //增大点击区域
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
    .cart-add {
      display: inline-block;
      padding: 6px; //增大点击区域
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
    .cart-decrease {
      &.fade-enter , &.move-leave-to
      {
        opacity: 0;
        transform: translateX(24px);
      }
      &.fade-enter-active , &.move-leave-active
      {
        transition: all 100s;
        opacity: 1;
        transform: translateX(0px);
      }
    }
    .cart-add {

    }
  }
</style>
