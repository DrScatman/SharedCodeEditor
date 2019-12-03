<template>
  <div id="page">
    <h2>Shared Code Editor: {{ fileName }}</h2>
    <br />
    <div id="editor">
      <textarea
        v-model="codeText"
        v-on:input="changeHandler"
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
      codeText: "",
      fileName: this.getFileName()
    };
  },

  methods: {
    changeHandler() {
      const entry = AppDB.ref().child("public/" + store.state.fileKey);

      if (entry != null) {
        entry.update({ codeText: this.codeText });
      } else {
        AppDB.ref()
          .child("private/" + store.state.fileKey)
          .update({ codeText: this.codeText });
      }
    },

    getFileName() {
      const entry = AppDB.ref().child("public/" + store.state.fileKey + "fileName");

      if (entry != null) {
        this.fileName = entry.once('value').then((snapshot) => { snapshot.val() });
      } 
      if (this.fileName == null || this.fileName.length == 0) {
          this.fileName = AppDB.ref().child("private/" + store.state.fileKey + "fileName")
          .once('value').then((snapshot) => { snapshot.val() });
      }
    },

    firebaseUpdateHandler(snapshot) {
      this.codeText = snapshot.val();
    }
  },

  mounted() {
    const entry = AppDB.ref().child("public/" + store.state.fileKey);

    if (entry != null) {
      entry.on("child_changed", this.firebaseUpdateHandler);
    } else {
      AppDB.ref()
        .child("private/" + store.state.fileKey)
        .on("child_changed", this.firebaseUpdateHandler);
    }
  },

  beforeDestroy() {
    const entry = AppDB.ref().child("public/" + store.state.fileKey);

    if (entry != null) {
      entry.off("child_changed", this.firebaseUpdateHandler);
    } else {
      AppDB.ref()
        .child("private/" + store.state.fileKey)
        .off("child_changed", this.firebaseUpdateHandler);
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
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid lightgray;
  border-radius: 4px;
}

h2 {
  padding: 4%;
}
</style>
