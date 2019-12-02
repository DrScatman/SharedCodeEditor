import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileKey: "",
    fileName: "",
    setFileKey(newKey) {
      this.fileKey = newKey;
    },
    setFileName(newName) {
      this.fileKey = newName;
    }
  },
})