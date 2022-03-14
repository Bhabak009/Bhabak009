<template>
  <div id="app">
    <Header></Header>
    <div class="main">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
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
.main {
  padding-top: 60px;
  height: 100%;
  background: #ffd857;
  background: #2d525f;
  /* background: #e9edef; */
}
</style>
