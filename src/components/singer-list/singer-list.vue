<template>
  <scroller class="singer-list"
            :probe-type="3"
            @scroll="onScroll">
    <ul ref="groupRef">
      <li
        class="list__group"
        v-for="group in data"
        :key="group.title"
      >
        <h2 class="list__group__title">
          {{ group.title }}
        </h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="list__group__item"
          >
            <img class="avatar" :src="item.pic" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list__fixed">
      <div class="list__fixed__title" v-show="currentTitle">
        {{ currentTitle }}
      </div>
    </div>
  </scroller>
</template>

<script>
import Scroller from '@/components/base/scroller/scroller'
import useFixedTitle from '@/components/singer-list/use-fixed-title'

export default {
  name: 'singer-list',
  components: {
    Scroller
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const {
      groupRef,
      onScroll,
      currentTitle
    } = useFixedTitle(props)

    return {
      groupRef,
      onScroll,
      currentTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list__group {
    padding-bottom: 30px;

    &__title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      background: $color-highlight-background;
    }

    &__item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list__fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    &__title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      background: $color-highlight-background;
    }
  }
}
</style>
