<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" :class="{'active':mySelectType===2}"
            @click="select(2)">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':mySelectType===0}" @click="select(0)">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" :class="{'active':mySelectType===1}" @click="select(1)">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div @click="toggleContent" class="switch"
         :class="{'on':myOnlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default: []
      },
      selectType: {
        type: Number,
        default: ALL
      },
      desc: {
        type: Object
      },
      onlyContent: {
        type: Boolean
      }
    },
    data() {
      return {
        mySelectType: this.selectType,
        myOnlyContent: this.onlyContent
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type){
        this.mySelectType = type;
        this.$emit('ratingTypeSelect', type);
      },
      toggleContent() {
        this.myOnlyContent = !this.myOnlyContent;
        this.$emit('ratingContentToggle', this.myOnlyContent);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .ratingselect {
    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      font-size: 0;
      .block {
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        line-height: 16px;
        border-radius: 1px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff
        }
        .count {
          margin-left: 2px;
          font-size: 8px;
        }
        &.positive {
          background: rgba(0, 160, 220, 0.2);
          &.active {
            background: rgb(0, 160, 220);
          }
        }
        &.negative {
          background: rgba(77, 85, 93, 0.2);
          &.active {
            background: rgb(77, 85, 93);
          }
        }

      }

    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on {
        .icon-check_circle {
          color: #00c850;
        }
      }
      .icon-check_circle {
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
