<template>
  <div v-show="isSignedIn !== null" class="oauth-wrapper">
    <div v-if="!isSignedIn" class="login-btn" @click="googleSignIn">Login</div>
    <div v-if="isSignedIn" class="user">
      <div class="user-name">{{ userData.name }}</div>
      <img :src="userData.photo" alt="">
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import Cookies from "js-cookie";

export default {
  data: () => ({
    userData: {
      name: '',
      email: '',
      photo: '',
    },
    isSignedIn: null,
  }),
  mounted () {
    this.googleCurrentUser();
  },
  methods: {
    googleCurrentUser() {
      let user =  getAuth().currentUser;
      console.log(user)
      if (!user) {
        const json = Cookies.get('googleUser');
        user = JSON.parse(json || 'null');
      }
      console.log(user)
      if(user) {
        this.userData = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }

        this.isSignedIn = true;
        Cookies.set('googleUser', JSON.stringify(user), { expires: 365 })
      } else {
        this.isSignedIn = false;
      }
    },
    googleSignIn() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.idToken;
          const user = result.user;
          this.googleCurrentUser()
        })
        .catch((error) => {
        });
    },
    googleSignOut() {
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.oauth-wrapper {
  flex: 0 1 auto;
  .login-btn {
    padding: 10px 20px;
    border-radius: 6px;
    background: #fff;
    font-weight: bold;
    cursor: pointer;
  }

  .user {
    display: flex;
    align-items: center;
    // font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    img {
      margin-left: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>


