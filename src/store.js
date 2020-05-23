import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex)

export const state = () => ({
})

export const actions = {
}

export const mutations = {
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
