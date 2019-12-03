import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileKey: "",
    fileName: "",
    userEmail: "",
    setUserEmail(email) {
      this.userEmail = email;
    },
    setFileKey(newKey) {
      this.fileKey = newKey;
    },
    setFileName(newName) {
      this.fileKey = newName;
    }
  },
})