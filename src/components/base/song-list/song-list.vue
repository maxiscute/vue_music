<template>
  <ul class="song-list">
    <li
      class="song-list__item"
      v-for="(song,index) in songs"
      :key="song.id"
      @click="clickSongItem(song, index)"
    >
      <div class="song-list__item__content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getSongDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['songItemClicked'],
  methods: {
    clickSongItem (song, index) {
      this.$emit('songItemClicked', {
        song,
        index
      })
    },
    getSongDesc (song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .song-list__item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .song-list__item__content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        @include no-wrap();
        color: $color-text
      }

      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
