import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export const state = () => ({
  token: null,
  userDetails: {},
})

export const mutations = {
  setToken(state, data) {
    state.token = data
  },
  setUserDetails(state, data) {
    state.userDetails = data
  }
}

export const getters = {
  token: state => state.token,
  userDetails: state => state.userDetails
}

export const actions = {
}

export default {
  state,
  mutations,
  getters,
  actions,
}