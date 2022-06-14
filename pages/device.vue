<template>
  <div class="device-wrapper">
    <h2>Power usage stats</h2>
    <div id="loader">
      <svg height="260" width="260" viewBox="-20 -20 240 240">
        <path id="back" d="M0,100 a100,100 0 1 0 200,0 a100,100 0 1 0 -200,0" fill="#FFFFFF" stroke="#e9edf7" stroke-width="30" stroke-linecap="round" />
        <path id="ring" d="M100,0 a100,100 0 0 1 0,200 a100,100 0 0 1 0,-200,0" fill="none" stroke="#3ba15d" stroke-width="30" stroke-dasharray="629" stroke-linecap="round" :stroke-dashoffset="circleDashoffset" />
      </svg>
      <div class="power-unit">
        {{ todayUsage }}<span class="limit">/{{ dailyPowerLimit }}</span> 
        <div class="value">Today Usage</div>
      </div>
    </div>
    <div v-for="i in switchValue.length" class="switch-container" :key="i">
      <p class="title">On/off switch {{i}}</p>
      <div class="switch-box">
        <input :checked="switchValue[i - 1] == '1'" type="checkbox" :id="'switch'+i" class="switch" @input="onToggle($event, i)" />
        <label :for="'switch'+i">Toggle</label>
      </div>
    </div>
    <h2 class="daily-power-title">Today Power Usage</h2>
    <client-only>
      <line-chart :data="electricityData"></line-chart>
    </client-only>
  </div>
</template>

<script>
import { getPower } from '@/services/power'
export default {
  data () {
    return {
      switchValue: '',
      todayUsage: 0,
      dailyPowerLimit: 9.2,
      rawData: null,
      chartData: {
        '2017-05-13': 2,
        '2017-05-14': 3,
        '2017-05-15': 4,
        '2017-05-16': 5,
      }
    }
  },
  computed: {
    electricityData () {
      if (!this.rawData) { return ({})}
      // const res = {
      //   data: this.rawData
      // }
      // let temp = 0
      // const TOTAL_TIME_RANGE = 19*60*60/10
      // this.timeStamp = res.data.Time.slice(res.data.Time.length - TOTAL_TIME_RANGE - 100, res.data.Time.length - 100)
      // this.powerUsage = res.data.Power.slice(res.data.Power.length - TOTAL_TIME_RANGE - 100, res.data.Power.length - 100)
      // temp = 0
      // this.powerUsage = this.powerUsage.map((amp, i) => {
      //   temp = amp*1
      //   return temp
      // })
      // this.timeStamp = this.timeStamp.map(value => this.getFilteredData(value*1000 - 1000*3600*5.5))
      // const finalData = {}
      // this.timeStamp.map((value, i) => {
      //   finalData[value] = this.powerUsage[i]
      // })
      const finalData = {}
      let lastPower = 0
      this.rawData.forEach(element => {
        // console.log(JSON.parse(element))
        // finalData.push(JSON.parse(element))
        if (!element) return
        const time = new Date(element.split(':')[0]*1000)
        const power = Math.abs(element.split(':')[1]) // todo: fix abs issue
        lastPower += power * 10 / 3600
        finalData[time] = lastPower
      });
      return finalData
    },
    circleDashoffset () {
      return 629 * (1 - Math.min(this.todayUsage / this.dailyPowerLimit, 1))
    }
  },
  mounted () {
    setTimeout(() => {
      this.animateCircle(6.4)
      this.fetchPowerData()
    }, 1000)
  },
  methods: {
    onToggle (e, type) {
      if(type <= 0) { return }

      const state = e.target.checked
      const userId = '110771677259066877542'
      const deviceId = this.$route.query.id || 'Esp1'
      const ref = this.$fireRef(this.$fireDb, `${userId}/devices/${deviceId}/trigger`)

      const index = type - 1
      let value = this.switchValue

      // Replacing state value at index
      const data = value.substring(0, index) + (state ? '1' : '0') + value.substring(index + 1);
      
      this.$fireSet(ref, data)
    },
    getFilteredData (data = 0) {
      if(data === 0) { return null}
      const dateObj = new Date(data)
      const sec = String(dateObj.getSeconds()).padStart(2, '0')
      const min = String(dateObj.getMinutes()).padStart(2, '0')
      const hour = String(dateObj.getHours()).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth()+1).padStart(2, '0');
      
      // const year = dateObj.getFullYear();
      const output = `${hour}:${min}:${sec} ${day}/${month}`
      return output
    },
    fetchPowerData () {
      const userId = '110771677259066877542'
      const deviceId = this.$route.query.id || 'Esp1'
      const ref = this.$fireRef(this.$fireDb, `${userId}/devices/${deviceId}/power`)

      // Will be called every time the data changes in the Firebase Realtime Database
      this.$fireOnValue(ref, (res) => {
        if (res.exists()) {
          this.rawData = res.val()
        }
      })

      const toggleRef = this.$fireRef(this.$fireDb, `${userId}/devices/${deviceId}/trigger`)
      this.$fireOnValue(toggleRef, (res) => {
        if (res.exists()) {
          this.switchValue = res.val()
          console.log(this.switchValue)
        }
      })
      //   setTimeout(() => {
      //     this.fetchPowerData()
      //   }, 5000)
      // }).catch(() => {
      //   setTimeout(() => {
      //     this.fetchPowerData()
      //   }, 5000)
      // })
    },
    animateCircle (target = 0) {
      if (this.todayUsage < target) {
        setTimeout(() => {
          this.todayUsage = parseFloat(this.todayUsage + 0.1).toFixed(2) - 0
          this.animateCircle(target)
        }, 20)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-box {
  position: relative;
  width: 60px;
  height: 30px;
  .switch {
    position: absolute;
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
    cursor: pointer;
    text-indent: -9999px;
    width: 60px;
    height: 30px;
    background: #aa4141;
    display: block;
    border-radius: 100px;
    position: relative;
  }

  label:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;
  }

  .switch:checked + label {
    background: #27702a;
  }

  .switch:checked + label:after {
    left: calc(100% - 5px);
    transform: translateX(-100%);
  }

  label:active:after {
    width: 40px;
  }
}

.device-wrapper {
  width: 100%;
  min-height: 100%;
  max-width: 600px;
  padding: 20px;
  padding-bottom: 160px;
  margin: 0 auto;
  h2 {
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 20px;
  }
  .switch-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    margin-bottom: 20px;
    border-radius: 12px;
    background-color: #e9ecf8;
    .title {
      font-size: 18px;
      font-weight: bold;
      line-height: 24px;
      color: #2a526d;
    }
  }
  .daily-power-title {
    margin-top: 50px;
  }
}
#loader {
  position: relative;
  width: 260px;
  height: 260px;
  margin: 0 auto;
  margin-bottom: 20px;
  .power-unit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #2b2b2b;
    .limit {
      font-size: 14px;
      font-weight: bold;
      color: #505050;
    }
    .value {
      font-size: 12px;
      font-weight: bold;
      color: #979aac;
    }
  }
}

@keyframes load {
  80% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>

