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
      fileName: ""
    };
  },

  methods: {
    async changeHandler() {
    var entry;

    await AppDB.ref().child("public/" + store.state.fileKey).once('value', function(snapshot) {
      if(snapshot.exists()) {
        entry = true;
      } else {
        entry = false;
      }
    });

    if(entry == true) {
        AppDB.ref().child("public/" + store.state.fileKey).update({ codeText: this.codeText });
    } else {
      AppDB.ref().child("private/" + store.state.fileKey).update({ codeText: this.codeText });
    }
    },

    firebaseUpdateHandler(snapshot) {
      this.codeText = snapshot.val();
    }
  },

   async mounted() {
    var entry;

    await AppDB.ref().child("public/" + store.state.fileKey).once('value', function(snapshot) {
      if(snapshot.exists()) {
        entry = true;
      } else {
        entry = false;
      }
    });

    if (entry === true) {
      AppDB.ref().child("public/" + store.state.fileKey).on("child_changed", this.firebaseUpdateHandler);
      AppDB.ref().child("public/" + store.state.fileKey + "/codeText/").once('value').then((snapshot) => this.firebaseUpdateHandler(snapshot));
      AppDB.ref().child("public/" + store.state.fileKey + "/fileName/").once('value').then((snapshot) => this.fileName = snapshot.val());
    } 
    else 
    {
      AppDB.ref().child("private/" + store.state.fileKey).on("child_changed", this.firebaseUpdateHandler);
      AppDB.ref().child("private/" + store.state.fileKey + "/codeText/").once('value').then((snapshot) => this.firebaseUpdateHandler(snapshot));
      AppDB.ref().child("private/" + store.state.fileKey + "/fileName/").once('value').then((snapshot) => this.fileName = snapshot.val());
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
  right: 0;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid lightgray;
  border-radius: 4px;
}

h2 {
  padding: 4%;
}
</style>
