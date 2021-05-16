<template>
  <scroller class="singer-list"
            :probe-type="3"
            @scroll="onScroll"
            ref="scrollRef">
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
            @click="onItemClick(item)"
          >
            <img class="avatar" :src="item.pic" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list__fixed">
      <div class="list__fixed__title"
           v-show="currentTitle"
           :style="currentStyle">
        {{ currentTitle }}
      </div>
    </div>
    <div
      class="list__shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent="onShortcutTouchEnd"
    >
      <div
        class="list__shortcut__hint"
        v-show="isTouch"
      >
        {{ currentTitle }}
      </div>
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="list__shortcut__item"
            :key="item"
            :data-index="index"
            :class="{'current':currentIndex===index}">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroller>
</template>

<script>
import Scroller from '@/components/base/scroller/scroller'
import useFixedTitle from '@/components/singer-list/use-fixed-title'
import useShortcut from '@/components/singer-list/use-shortcut'

export default {
  name: 'singer-list',
  components: {
    Scroller
  },
  emits: ['clickSinger'],
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
      currentTitle,
      currentIndex,
      currentStyle
    } = useFixedTitle(props)

    const {
      shortcutList,
      scrollRef,
      isTouch,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd
    } = useShortcut(props, groupRef)

    const onItemClick = (item) => {
      console.log('onItemClick')
      console.log(item)
      emit('clickSinger', item)
    }

    return {
      groupRef,
      scrollRef,
      currentTitle,
      currentIndex,
      currentStyle,
      shortcutList,
      isTouch,
      onScroll,
      onShortcutTouchStart,
      onShortcutTouchMove,
      onShortcutTouchEnd,
      onItemClick
    }
  }
}
</script>

<style lang="scss" scoped>
$shortcutColor: var(--shortcutColor, #ffcd32);

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

  .list__shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    &__item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $shortcutColor;
      }
    }

    &__hint {
      position: absolute;
      top: 50%;
      right: 200%;
      transform: translateY(-50%);
      display: block;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      background: $color-background-d;
      border-radius: 50% 50%;
      color: $shortcutColor;
    }
  }
}
</style>
