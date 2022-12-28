<template>
  <div class="container">
    <div
      class="inner"
      :class="{ 'no-result': !movies.length }">
      <Loader v-if="loading" />
      <div
        class="message"
        v-if="message">
        {{ message }}
      </div>
      <div
        class="movies"
        v-else>
        <MovieItem
          v-for="movie in movies"
          :key="movie.imdbID" 
          :movie="movie" />
      </div>
    </div>
  </div>
</template>

<script>
import MovieItem from '~/components/MovieItem'
import Loader from '~/components/Loader'

export default {
  computed: {
    movies(){
      return this.$store.state.movie.movies
    },
    message (){
      return this.$store.state.movie.message
    },
    loading (){
      return this.$store.state.movie.loading
    }
  },
  components: {
    MovieItem,
    Loader
  }
}
</script>

<style lang="scss" scoped>

  .container {
    margin-top: 30px;
    .inner {
      background-color: $gray-200;
      padding: 10px 0;
      border-radius: 4px;
      text-align: center;
      &.no-result {
        padding: 70px 0;
      }
    }
    .message {
      color: $gray-400;
      font-size: 20px;
    }
    .movies {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>