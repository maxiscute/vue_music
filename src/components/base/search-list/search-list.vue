<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        v-for="item in searches"
        :key="item"
        class="search-item"
        @click="onSearchHistoryItemClick(item)"
      >
        <span class="text">{{ item }}</span>
        <span
          v-if="showDelete"
          class="icon"
          @click.stop="onDeleteSearchHistoryItemClick(item)"
        >
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['searchHistoryItemClick', 'deleteSearchHistoryItem'],
  methods: {
    onSearchHistoryItemClick (item) {
      this.$emit('searchHistoryItemClick', item)
    },
    onDeleteSearchHistoryItemClick (item) {
      this.$emit('deleteSearchHistoryItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    .text {
      flex: 1;
      color: $color-text-l;
    }

    .icon {
      @include extend-click();

      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
