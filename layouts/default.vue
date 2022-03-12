<template>
  <div id="app">
    <Header></Header>
    <div class="main">
      <Nuxt />
    </div>
  </div>
</template>

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
  height: calc(100% - 60px);
}
</style>
