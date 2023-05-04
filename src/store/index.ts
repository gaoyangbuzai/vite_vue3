import { createStore } from 'vuex';

const defaultState = {
  count: 0,
}

export default createStore({
  state() {
    return defaultState
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count += 1;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment')
    },
    // 退出系统
    LogOut() {
      return new Promise<void>((resolve) => {
        resolve();
      })
    },
  },
  getters: {
    doubleCount(state: typeof defaultState) {
      return state.count * 2;
    }
  }
})
