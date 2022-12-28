import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  // module
  namespaced: true,
  // data
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
    loading: false,
    theMovie: {}
  }),
  // computed
  getters: {},
  // methods
  // 변이
  mutations: {
    updateState(state, payload){
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state){
      state.movies = []
    }
  },
  // 비동기
  actions: {
    async searchMovies({ state, commit }, payload){  // function 앞에 async를 붙이면 항상 프로미스 반환
      // Search movies
      if (state.loading) return

      commit('updateState', {
        message: '',
        loading: true,
      })

      try {
        const res = await _fetchMovie({  //await는 async 안에서만 동작함
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
        console.log(totalResults); //306  => 31
        console.log(typeof totalResults);  //string

        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10)

        // 추가 요청
        if(pageLength > 1) {
          for (let page = 2; page <= pageLength; page += 1) {
            if (page > (payload.number / 10)) break
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const { Search } = res.data
            commit('updateState', {
              movies: [
                ...state.movies, 
                ..._uniqBy(Search, 'imdbID')
              ]
            })
          }
        }
      } catch (message) {
        commit('updateState', {
          movies: [],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({state, commit}, payload){
      if(state.loading) return

      commit('updateState', {
        theMovie: {},
        loading: true
      })
      
      try {  //성공
        const res = await _fetchMovie(payload)
        commit('updateState', {
          theMovie: res.data
        })
        console.log(res.data);
      } catch (error) {  //실패
        commit('updateState', {
          theMovie: {}
        })
      } finally {  //보류
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

function _fetchMovie(payload){
  const { title, type, year, page, id } = payload
  const OMDB_API_KEY = '7035c60c'
  const url = id 
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`

  return new Promise((resolve, reject)=>{
    axios.get(url)
      .then(res => {
        if (res.data.Error) {
          reject(res.data.Error)
        }
        resolve(res)
      })
      .catch(err => {
        reject(err.message)
      })
  })
}