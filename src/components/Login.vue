<template>
  <div id="page">
    <v-container id="loginForm" v-show="isLoggedIn === false">
      <v-row>
        <v-text-field label="Username/Email" v-model="userEmail" />
      </v-row>
      <v-row>
        <v-text-field type="password" label="Password" v-model="userPassword" />
      </v-row>
      <v-row justify="end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="doSignUp" v-on="on">SignUp</v-btn>
            <v-snackbar v-model="snackbar"
              >{{ text }}
              <v-btn color="red" @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </template>
          <span
            >Create an account by entering your preferred email and
            password.</span
          >
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="doSignIn" v-on="on">SignIn</v-btn>
          </template>
          <span
            >Sign into an existing account that you've already created.</span
          >
        </v-tooltip>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { AppAUTH } from "../db-init.js";
import store from '../store.js';

export default {
  data: function() {
    return {
      userEmail: "",
      userPassword: "",
      isLoggedIn: false,
      snackbar: false,
      text: ""
    };
  },

  methods: {
    doSignUp() {
      AppAUTH.createUserWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(() => {
          store.state.setUserEmail(this.userEmail);
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          this.snackbar = true;
          this.text = err;
        });
    },

    doSignIn() {
      AppAUTH.signInWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(() => {
          store.state.setUserEmail(this.userEmail);
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          this.snackbar = true;
          this.text = err;
        });
    }
  },

  mounted() {
    AppAUTH.onAuthStateChanged(u => {
      this.isLoggedIn = u !== null;
    });
  }
};
</script>

<style>
#page {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto;
}

#loginForm {
  width: 40vw;
  border-color: grey;
  border-style: solid;
  border-radius: 15px;
  padding: 10%;
  display: grid;
  margin: 2%;
  grid-template-rows: auto auto auto;
}

#publicTable {
  width: 50vw;
  height: 300px;
  border-color: grey;
  border-style: solid;
  border-radius: 15px;
  padding: 2%;
  display: grid;
  margin: 2%;
  grid-column-start: 2;
}
</style>
