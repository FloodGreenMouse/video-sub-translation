import api from './api'

export const state = () => ({})

export const actions = {
  getTranslate ({ dispatch }, word) {
    return api.getTranslate(word)
  }
}

export const mutations = {}

export default {
  state,
  actions,
  mutations
}
