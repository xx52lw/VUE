import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import LStore from './LoginStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: 'aaa',
    // 下一个Id
    nextId: 5
  },
  mutations: {
    initList (state, data) {
      state.list = data
    },
    setInputValue (state, val) {
      state.inputValue = val
    },
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        console.info(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    }
  },
  // 引入新的模块
  modules: {
    // 从新命名
    loginStore: LStore
  }
})
