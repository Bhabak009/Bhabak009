<template>
  <div class="dashboard">
    <div class="top-intro">
      <div class="r1">Hello,</div>
      <div class="r2">{{ userDetails.name }}</div>
    </div>
    <div class="main-container">
      <section class="devices">
        <div class="devices-title">
          <h2>Devices</h2>
          <div class="cards-container">
            <div class="card" v-for="device in allDevices" @click="deviceCardClicked(device)">
              <div class="title">{{ device.name }}</div>
              <div class="power">
                <div class="value">{{ device.todayPowerUsage }} / {{ device.dailyPowerLimit }}</div>
                <div class="desc">Today power usage</div>
              </div>
            </div>
            <a href="http://smart-energy-bpp.herokuapp.com/new-device" target="_blank" class="card add">
              <div class="title">Add new device</div>
            </a>
          </div>
        </div>
      </section>
      <!-- <client-only placeholder="loading...">
        <line-chart :data="chartData"></line-chart>
      </client-only> -->
    </div>
    <div v-show="showAlert" class="alert-modal">
      <div class="middle">
        <div class="title">{{ alertMsg.content }}</div>
        <div class="desc">{{ new Date(alertMsg.time) }}</div>
        <div class="alertBtn" @click="() => {showAlert = false}">OK</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showAlert: false,
      alertMsg: {
        time: 0,
        content: ''
      },
      chartData: {
        '2017-05-13': 2,
        '2017-05-14': 3,
        '2017-05-15': 4,
        '2017-05-16': 5,
      },
      allDevices: [
        {
          name: 'Esp32',
          status: 'online',
          todayPowerUsage: 6.4,
          dailyPowerLimit: 9.2
        }
      ],
    }
  },
  computed: {
    ...mapGetters(['token', 'userDetails'])
  },
  mounted () {
    this.getAllDevices()
  },
  methods: {
    getAllDevices () {
      const userId = '110771677259066877542'
      const ref = this.$fireRef(this.$fireDb, `${userId}/devices`)
      this.$fireGet(ref).then((res) => {
        if (res.exists()) {
          this.allDevices = res.val()
          this.listenAlerts()
        }
      })
    },
    listenAlerts () {
      const userId = '110771677259066877542'
      const landingTime = new Date().getTime()

      Object.keys(this.allDevices).forEach(deviceName => {
        const alertRef = this.$fireRef(this.$fireDb, `${userId}/devices/${deviceName}/alert`)
        this.$fireOnValue(alertRef, (res) => {
          if (!res.exists()) { return }

          const lastTime = res.val()
          if (landingTime > lastTime ) { return } // alert in 1 minute of page load

          this.showAlert = true
          this.alertMsg = {
            time: lastTime,
            content: 'High power usage'
          }
        })
      })
      
    },
    deviceCardClicked (device) {
      this.$router.push({
        path: `/device`,
        query: {
          id: device.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.alert-modal{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .middle{
    width: 400px;
    height: 200px;
    background: rgb(235, 118, 118);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;

    .title{
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .desc{
      font-size: 14px;
      color: rgb(42, 42, 42);
    }
    
    .alertBtn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 30px;
      background: #00a8ff;
      border-radius: 5px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      outline: none;
      border: none;
      margin-top: 10px;
    }
  }
}
.dashboard {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.top-intro {
  padding: 20px;
  margin-bottom: 24px;
  .r1 {
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    color: rgb(255, 255, 255);
  }
  .r2 {
    font-size: 28px;
    font-weight: bold;
    line-height: 36px;
    color: #fff;
  }
}
.main-container {
  height: 100%;
  padding: 20px;
  border-radius: 36px 36px 0 0;
  background: rgb(255, 255, 255);
}
.devices-title {
  margin-bottom: 24px;
  padding: 12px 0;
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: normal;
    line-height: 24px;
    color: rgb(22, 22, 22);
  }
}
.cards-container {
  display: flex;
  height: 180px;
  width: 100%;
  overflow: scroll;
  .card {
    position: relative;
    flex: 0 0 auto;
    width: 240px;
    height: 160px;
    margin-right: 16px;
    padding: 20px;
    border-radius: 16px;
    background: linear-gradient(135deg, #457488, #2d525f, #162d36);
    cursor: pointer;
    &.add {
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      line-height: 24px;
      color: #ebecf1;
      // background: linear-gradient(to right, #ffd857, #ffa726);
    }
    .power {
      position: absolute;
      bottom: 20px;
       .value{
         font-size: 32px;
         line-height: 38px;
         font-weight: bold;
         color: #ebecf1;
       }
      .desc {
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        color: rgb(157, 175, 182);
      }
    }
  }
}
</style>