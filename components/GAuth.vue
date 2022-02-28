<template>
  <button @click="OauthInitiate">google</button>
</template>

<script>
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
export default {
  methods: {
    OauthInitiate() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.idToken;
          // The signed-in user info.
          console.log(token);

          const user = result.user;
          console.log(auth);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      console.log(auth);
    },
  },
};
</script>

<style>
</style>


