<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn @click="dialog = true" v-show="isLoggedIn === true" v-on="on">SignOut</v-btn>
                </template>
                <span>Sign out of your account.</span>
            </v-tooltip>
      <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Sign Out</v-card-title>
        <v-card-text>Are you sure you want to sign out?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="doSignOut" >Yes</v-btn>
          <v-btn @click="dialog = false" >Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
// import Login from './components/Login';
import { AppAUTH } from "./db-init.js";
import store from './store.js'

export default {
  store,
  name: 'App',
  components: {
    // Login,
  },
  data: () => ({
      fileKey: store.state.fileKey,
      isLoggedIn: false,
      dialog: false
  }),

  methods: {
    doSignOut() {
        AppAUTH.signOut().then(() => {
          // Needs to go backk to sign-in
            this.$router.back().back();
            this.dialog = false
        });
    }
  },

  mounted() {
        AppAUTH.onAuthStateChanged((u) => {
            this.isLoggedIn = u !== null;
        });
  }

};
</script>
