<template>
  <div id="page">
    <h2>Shared Code Editor: {{ currFileKey }}</h2>
    <br />
    <div id="editor">
      <textarea
        v-model="codeText"
        v-mode.lazy="codeText"
        v-on:change="changeHandler"
        placeholder=""
        type="text"
      >
      </textarea>
    </div>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";
import store from "../store.js";

export default {
  store,
  data() {
    return {
      currFileKey: store.state.fileKey,
      codeText: ""
    };
  },

  methods: {
    changeHandler() {
      const entry = AppDB.ref().child("public/" + store.state.fileKey);
      if (entry != null) {
        entry.update({ codeText: this.codeText });
      } else {
        AppDB.ref("private/" + store.state.fileKey).update({
          codeText: this.codeText
        });
      }
    }
  }
};
</script>

<style>
#editor {
  margin: 0;
  height: 100%;
}

textarea {
  position: absolute;
  top: 80px; /* Header Height */
  bottom: 20px; /* Footer Height */
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
}

h2 {
  padding: 4%;
}
</style>
