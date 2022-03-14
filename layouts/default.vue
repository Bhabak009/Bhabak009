<template>
  <div id="app">
    <Header></Header>
    <div class="main" :style="{background: mainBg}">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  computed: {
    mainBg () {
      let bgColor = '#fff';
      if (this.$route.name == 'dashboard') {
        bgColor = '#2d525f';
      }
      if (this.$route.name == 'new-device') {
        bgColor = '#2d525f';
      }
      return bgColor
    }
  },
  mounted () {
    const userJson = Cookies.get('googleUser');
    if (!userJson) {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
html, body, #__nuxt, #__layout, #app {
  width: 100%;
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
  margin-top: 60px;
  /* background: #ffd857;
  background: #2d525f; */
  overflow-y: auto;
  /* background: #e9edef; */
}
</style>
