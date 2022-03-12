<template>
  <div v-show="isSignedIn !== null" class="oauth-wrapper">
    <div v-if="!isSignedIn" class="login-btn" @click="googleSignIn">Login</div>
    <div v-if="isSignedIn" class="user" @click="googleSignOut">
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
import { setUser } from "@/services/user";
import Cookies from "js-cookie";


export default {
  data: () => ({
    userData: {
      uid: '',
      name: '',
      email: '',
      phone: '',
      photo: '',
    },
    isSignedIn: null,
  }),
  mounted () {
    this.$nuxt.$on('sign-in', () => {
      this.googleSignIn()
    });
    this.$nuxt.$on('sign-out', () => {
      this.googleSignOut()
    });
    this.googleCurrentUser();
  },
  beforeDestroy () {
    this.$nuxt.$off('sign-in');
    this.$nuxt.$off('sign-out');
  },
  methods: {
    setUserOnFirebase (user) {
      console.log(user);
      setUser(user).then((res) => {
        console.log(res)
      });
    },
    googleCurrentUser(isCurrentLogin = false) {
      let user =  getAuth().currentUser;
      if (!user) {
        try {
          const json = Cookies.get('googleUser');
          user = JSON.parse(json || 'null');
        }
        catch (e) {
          user = null;
        }
      }
      console.log(user)
      if(user) {
        const providerData = user.providerData[0] || {};
        this.userData = {
          uid: providerData.uid,
          name: providerData.displayName,
          email: providerData.email,
          phone: providerData.phoneNumber,
          photo: providerData.photoURL,
        }
        if(isCurrentLogin) {
          this.setUserOnFirebase(this.userData);
        }
        this.isSignedIn = true;
        this.$router.push('/dashboard');
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
          this.googleCurrentUser(true)
        })
        .catch((error) => {
        });
    },
    googleSignOut() {
      const auth = getAuth();
      signOut(auth).then(() => {
        Cookies.remove('googleUser')
        this.googleCurrentUser()
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
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    img {
      margin-left: 8px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }
  }
}
</style>


