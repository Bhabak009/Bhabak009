<template>
  <div class="top-header">
    <div class="logo">
      <img src="~/static/icon.png" alt="logo">
    </div>
    <g-auth></g-auth>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: rgb(72, 140, 204);

  .logo {
    display: flex;
    align-items: center;
    height: 30px;
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    color: #fff;
    img {
      margin-right: 8px;
      height: 100%;
    }
  }
}
</style>