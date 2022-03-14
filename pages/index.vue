<template>
  <div class="landing-warp">
    <div class="logo">
      <img src="~/static/icon.png" alt="">
    </div>
    <h2 class="title">A live Electricity <br> Measuring Tool</h2>
    <p class="description">A platform where you can measure electricity usage of our household on a daily basis.</p>
    <div class="start-btn" @click="startClicked">
      Get Started ➜
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startClicked() {
      this.$nuxt.$emit('sign-in');
    }
  }
}
</script>
<style lang="scss" scoped>
.landing-warp {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 15vh;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  background: #fff;
  .logo {
    width: 100px;
    margin-bottom: 40px;
    img {
      width: 100%;
    }
  }
  .title {
    text-align: center;
    font-size: calc(36px + (76 - 36) * (100vw - 360px) / (1440 - 360));
    line-height: calc(44px + (92 - 44) * (100vw - 360px) / (1440 - 360));
    font-weight: 900;
    background: linear-gradient(315deg,#33a572 25%,#354ab3);
    background-clip: text;
    color: transparent;
  }
  .description {
    margin-top: 20px;
    text-align: center;
    font-size: calc(16px + (22 - 16) * (100vw - 360px) / (1440 - 360));
    line-height: calc(24px + (28 - 24) * (100vw - 360px) / (1440 - 360));
    color: rgba(60, 60, 60, 0.7);
  }
  .start-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    padding : 10px 16px;
    border-radius: 8px;
    background: linear-gradient(to right, #ffb347, #ffcc33);
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
