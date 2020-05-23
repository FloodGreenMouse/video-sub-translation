import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex)

export const state = () => ({
  currentTime: 0
})

export const actions = {
  setCurrentTime ({ commit }, time) {
    commit('SET_CURRENT_TIME', time)
  }
}

export const mutations = {
  SET_CURRENT_TIME (state, time) {
    state.currentTime = time
  }
}

export const modules = {
  api
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules
})
