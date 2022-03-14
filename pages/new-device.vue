<template>
  <div class="new-device">
    <ul class="top-intro">
      <li>Disconnect your current wifi</li>
      <li>{{ uid }}</li>
    </ul>
    <div class="main-container">
      <section class="wifi">
        <div class="wifi-title">
          <h2>Available Wi-Fi</h2>
        </div>
        <div class="cards-container">
          <div class="card" v-for="wifi in allWifi" :key="wifi.name" @click="wifiCardClicked(wifi.name)">
            {{ wifi.name }}
          </div>
          <div v-if="allWifi.length == 0" class="card">
            No wifi available
          </div>
        </div>
      </section>
      <div class="status">{{statusText}}</div>
    </div>
    <div class="popup" v-if="showPopup" @click.self="()=> {showPopup = false}">
      <div class="middle">
        <div class="title">Connect to wifi</div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="wifiPassword">
        </div>
        <div class="button" @click="setWifiId">Connect</div>
      </div>
    </div>
  </div>
</template>

<script>
import { scanWifi, setUserId, setSsid } from '@/services/wifi'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      rawSsids: {},
      wifiName: '',
      wifiPassword: '',
      statusText: '',
      showPopup: false
    }
  },
  computed: {
    ...mapGetters(['userDetails']),
    uid () {
      return this.userDetails.uid
    },
    allWifi () {
      return Object.keys(this.rawSsids).map((key) => ({name: key, range: this.rawSsids[key]}));
    }
  },
  mounted () {
    this.getWifi();
  },
  methods: {
    wifiCardClicked (name) {
      this.wifiName = name;
      this.showPopup = true;
    },
    setWifiId () {
      if(!this.wifiPassword) {
        return;
      }
      const data = {
        ssid: this.wifiName,
        password: this.wifiPassword,
      }
      console.log(data)
      this.sendUid()
      setSsid(data).then(() => {
        this.statusText = 'Connected successfully'
      })
    },
    sendUid () {
      setUserId({ uid: this.uid }).then(()=> {
      }).catch(() => {
        this.sendUid();
      })
    },
    getWifi () {
      setInterval(() => {
        scanWifi().then((ssids) => {
          this.rawSsids = ssids;
        });
      }, 10000);
    }
  }
}
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10;
  .middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 340px;
    height: 240px;
    background: #fff;
    border-radius: 24px;
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .input {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      input {
        width: 240px;
        height: 44px;
        border-radius: 6px;
        border: 1px solid #ccc;
        padding: 0 12px;
        font-size: 16px;
        font-weight: bold;
        outline: none;
      }
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 44px;
      border-radius: 6px;
      border: none;
      background: #000;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      outline: none;
      cursor: pointer;
    }
  }
}
.new-device {
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.top-intro {
  padding: 20px 40px;
  margin-bottom: 24px;
  li {
    font-size: 18px;
    line-height: 24px;
    color: rgb(255, 255, 255);
    &::marker {
      padding-left: 20px;
    }
  }
}
.main-container {
  height: 100%;
  padding: 20px;
  border-radius: 36px 36px 0 0;
  background: rgb(255, 255, 255);
}
.wifi-title {
  margin-bottom: 24px;
  padding: 12px 0;
  h2 {
    font-size: 20px;
    font-weight: normal;
    line-height: 24px;
    color: rgb(22, 22, 22);
  }
}
.card {
  padding: 12px;
  border-radius: 8px;
  background: #e1e8ec; 
  box-shadow: 5px 5px 10px rgba(141, 169, 185, 0.5);
  color: rgb(62, 76, 107);
  margin-bottom: 20px;
  cursor: pointer;
}
</style>
