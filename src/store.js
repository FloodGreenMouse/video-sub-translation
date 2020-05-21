import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentTime: 0
  },
  actions: {
    setCurrentTime ({ commit }, time) {
      commit('SET_CURRENT_TIME', time)
    }
  },
  mutations: {
    SET_CURRENT_TIME (state, time) {
      state.currentTime = time
    }
  }
})
