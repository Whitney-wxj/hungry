<template>
  <div class="goods" ref="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item  menu-wrapper-hook"
            :class="{current: currentIndex==index}"
            @click="selectMenu(index)">
          <span class="text">
            <span v-show="item.type>0" class="icon"
                  :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>

    <div class="goods-wrapper" ref="goodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list goods-wrapper-hook">   <!-- goods-wrapper-hook只给js用，没有实际样式-->
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item" @click="selectFood(food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!--加入或减少数量的容器-->
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车-->
    <shopcart ref="shopcart" :select-foods="selectFoods" v-if="seller" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"></shopcart>
    <!--商品详情组件-->
    <food :food="selectedFood" ref="food" @cartAdd="cartAdd"></food>
  </div>
</template>

<script>
  import BetterScroll from 'better-scroll';
  import Shopcart from '../shopcart/Shopcart.vue';
  import Cartcontrol from '../cartcontrol/Cartcontrol.vue';
  import Food from '../food/Food.vue';

  export default {
    data() {
      return {
        goods: [],
        listHeight: [],
        menuHeight: [],
        visiHeight: 0,
        scrollY: 0,
        menuScrollY: 0,
        goodsScroll: null,
        selectedFood: null
      }
    },
    props: ["seller"],
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            /*let menuList = this.$refs.menuWrapper.getElementsByClassName("menu-wrapper-hook");
            let el = menuList[i];
            if (this.menuHeight[i + 1] >= this.visiHeight || Math.abs(this.menuScrollY) >= this.menuHeight[i]) {//超出可视区
              this.menuScroll.scrollToElement(el, 500);
            }  bug*/
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        console.log("seectfoods:" + foods);
        return foods;
      }
    },
    created() {
      this.$http.get("/api/goods").then((data) => {
        if (data.data.errno == 0) {
          this.goods = data.data.data;
          console.log(this.goods);
          this.$nextTick(() => {
            this.initScroll();
            this.calcHeight();
          });
        }
      }, (err) => {
        console.log(err);
      });
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    methods: {
      initScroll() {
        this.menuScroll = new BetterScroll(this.$refs.menuWrapper, {
          click: true, /*因为better-scroll会取消默认点击*/
          probeType: 3
        });
        this.menuScroll.on("scroll", (pos) => {
          // console.log("m:" + pos.y);
          this.menuScrollY = pos.y;
        });

        this.goodsScroll = new BetterScroll(this.$refs.goodsWrapper, {
          probeType: 3,  //相当于探针，实时告知滚动位置
          click: true,
        });
        this.goodsScroll.on("scroll", (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));

        });
      },
      calcHeight() {
        let goodsList = this.$refs.goodsWrapper.getElementsByClassName("goods-wrapper-hook");
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < goodsList.length; i++) {
          let item = goodsList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }

        //计算菜单条高度
        let menuList = this.$refs.menuWrapper.getElementsByClassName("menu-wrapper-hook");
        let height2 = 0;
        this.menuHeight.push(height2);
        for (let i = 0; i < menuList.length; i++) {
          let item = menuList[i];
          height2 += item.clientHeight;
          this.menuHeight.push(height2);
        }
        console.log(this.menuHeight);
        this.visiHeight = this.$refs.goods.clientHeight;
        console.log(this.visiHeight);

      },
      selectMenu(index) {
        console.log(index);
        let goodsList = this.$refs.goodsWrapper.getElementsByClassName("goods-wrapper-hook");
        let el = goodsList[index];
        this.goodsScroll.scrollToElement(el, 500);
      },
//      处理小球动画时需要的
      cartAdd(target) {
        console.log("xiaoqiu");
        console.log(target);

        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectFood(food){
        this.selectedFood = food;
        this.$refs.food.show();   //调用子组件methods中的show()方法
      }
    },
    components: {
      shopcart: Shopcart,
      cartcontrol: Cartcontrol,
      food: Food
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .goods {
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    display: flex;
    overflow: hidden;
    /*overflow: auto;*/
    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px; //不写,在android上有问题
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current {
          background: #fff;
          z-index: 10;
          .text {
            border-bottom: none;
            font-weight: 600;
          }
        }
        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background-size: 16px;
          vertical-align: top;
          &.decrease {
            background-image: url('img/decrease_3@2x.png');
          }
          &.discount {
            background-image: url('img/discount_3@2x.png');
          }
          &.guarantee {
            background-image: url('img/guarantee_3@2x.png');
          }
          &.invoice {
            background-image: url('img/invoice_3@2x.png');
          }
          &.special {
            background-image: url('img/special_3@2x.png');
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 12px;
          /*border-bottom: 1px solid rgba(7, 17, 27, .1);*/
          /*移动端1px*/
          position: relative;
          &:after {
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            border-top: 1px solid rgba(7, 17, 27, .1);
            content: ' '
          }
        }
      }
    }
    .goods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9ddee;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        &:last-child {
          border-bottom: none;
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          position: relative;
          .name {
            margin: 2px 0 8px 0;
            color: rgb(7, 17, 27);
            font-size: 14px;
            line-height: 14px;
            height: 14px;
          }
          .desc, .extra {
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;;
              color: rgb(147, 153, 159);
              font-size: 10px;
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
