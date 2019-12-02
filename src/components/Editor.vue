<template>
  <div id="page">
    <h2>Shared Code Editor: {{ currFileKey }}</h2>
    <br />
    <div id="editor">
      <textarea v-on:change="changeHandler" placeholder=""> </textarea>
    </div>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";
import store from "../store.js";

export default {
  store,
  data() {
    return { currFileKey: store.state.fileKey };
  },

  methods: {
    changeHandler(changeEvent) {
      AppDB.ref("public/" + store.state.fileKey)
        .update({ codeText: changeEvent.codeText })
        .catch(() => {});
      AppDB.ref("private/" + store.state.fileKey).update({
        codeText: changeEvent.codeText
      });
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
