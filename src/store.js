import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileKey: "",
    set (newKey) {
        this.fileKey = newKey;
      }
  },
})