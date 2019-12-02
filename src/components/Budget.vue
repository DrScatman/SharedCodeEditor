<template>
  <div id="page">
    <h2>Shared Code Editor</h2>
    <div id="workoutForm">
      <v-text-field label="File Name" type="text" v-model="fileName" />
      <v-text-field
        label="File Type (extension)"
        type="text"
        v-model="fileType"
      />
      <v-select
        v-model="databasePrivacy"
        v-bind:items="privacyOptions"
        label="Privacy"
      ></v-select>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" @click="addFileButtonHandler" v-on="on"
            >Create File</v-btn
          >
        </template>
        <span>Add item to the table.</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            @click="editFileButtonHandler"
            v-on="on"
            v-bind:disabled="userSelections.length == 0"
            >Edit Selection</v-btn
          >
        </template>
        <span>Add item to the table.</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            @click="removeButtonHandler"
            v-bind:disabled="userSelections.length == 0"
            v-on="on"
            >Remove Selection(s)</v-btn
          >
        </template>
        <span>Remove the selected items from the table.</span>
      </v-tooltip>
    </div>
    <div id="table">
      <v-simple-table fixed-header height="300px">
        <table>
          <thead>
            <tr>
              <th id="th">File Name</th>
              <th id="th">File Type</th>
              <th id="th">Privacy</th>
              <th id="th">Selection</th>
            </tr>
          </thead>
          <tbody>
            <tr id="dataRows" v-for="(myFiles, pos) in myFiles" :key="pos">
              <td>{{ myFiles.fileName }}</td>
              <td>{{ myFiles.fileType }}</td>
              <td>{{ myFiles.privacy }}</td>
              <td>
                <input
                  type="checkbox"
                  v-bind:id="myFiles.mykey"
                  v-on:change="selectionHandler"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";
import store from '../store.js'

export default {
  store,
  data() {
    return {
      privacyOptions: ["Private", "Public"],
      userSelections: [],
      myFiles: [],
      fileName: "",
      fileType: "",
      databasePrivacy: "",
      currFileKey: store.state.fileKey
    };
  },

  methods: {
    removeExpenseItem(snapshot) {
      /* snapshot.key will hold the key of the item being REMOVED */
      const item = snapshot.val();
      if (item.privacy == "Private") {
        this.myFiles = this.myFiles.filter(z => z.mykey != snapshot.key);
        this.userSelections = [];
      } else {
        alert("Cannot Delete Public Files");
      }
    },

    dataHandler(snapshot) {
      const item = snapshot.val();
      this.myFiles.push({ ...item, mykey: snapshot.key });
    },

    addFileButtonHandler() {
      AppDB.ref(this.databasePrivacy.endsWith("e") ? "private" : "public")
        .push()
        .set({
          fileName: this.fileName,
          fileType: this.fileType,
          privacy: this.databasePrivacy,
          codeText: ""
        });
    },

    editFileButtonHandler() {
      this.$router.push({ path: "/editor" });
    },

    removeButtonHandler() {
      this.userSelections.forEach(victimKey => {
        AppDB.ref("private")
          .child(victimKey)
          .remove();
      });
    },

    selectionHandler(changeEvent) {
      const whichKey = changeEvent.target.id;
      
      if (changeEvent.target.checked) {
        store.state.setFileKey(whichKey);
        this.userSelections.push(whichKey);

      } 
      else 
      {
        this.userSelections = this.userSelections.filter(function(value) {
          if (value != whichKey) {
              store.state.setFileKey(value);
            return true;
          }
          return false;
        });

        if (this.userSelections.length == 0) {
                  store.state.setFileKey("");
        }
      }
    }
  },
  mounted() {
    AppDB.ref("private").on("child_added", this.dataHandler);
    AppDB.ref("private").on("child_removed", this.removeExpenseItem);
    AppDB.ref("public").on("child_added", this.dataHandler);
    AppDB.ref("public").on("child_removed", this.removeExpenseItem);
  },

  beforeDestroy() {
    AppDB.ref("private").off("child_added", this.dataHandler);
    AppDB.ref("private").off("child_removed", this.removeExpenseItem);
    AppDB.ref("public").off("child_added", this.dataHandler);
    AppDB.ref("public").off("child_removed", this.removeExpenseItem);
  }
};
</script>

<style>
#page {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto;
}

#workoutForm {
  width: 40vw;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 3%;
  grid-column-start: 1;
}

#table {
  width: 50vw;
  height: 335px;
  border-color: hsl(204, 9%, 62%);
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 3%;
  grid-column-start: 2;
}

#th {
  background-color: hsl(204, 57%, 25%);
  color: hsl(204, 57%, 92%);
}

h2 {
  padding: 4%;
}

#amt {
  text-align: right;
}

#total {
  text-align: right;
  font-weight: bold;
}

#dataRows:nth-child(even) {
  background-color: hsl(204, 57%, 56%);
}

#dataRows:nth-child(odd) {
  background-color: hsl(189, 62%, 69%);
}
</style>
