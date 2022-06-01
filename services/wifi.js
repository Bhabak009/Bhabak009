const axios = require('axios')

export const scanWifi = (payload) => {
  const options = {
    method: 'GET',
    url: 'http://192.168.4.1/scan'
  }
  return axios(options)
}
export const setUserId = (payload) => {
  const options = {
    method: 'POST',
    url: 'http://192.168.4.1/setuid',
    headers: payload
  }
  return axios(options)
}

export const setSsid = (payload) => {
  const options = {
    method: 'POST',
    url: 'http://192.168.4.1/wifi',
    headers: {
    "ssid":payload.ssid,
    "password":payload.password,
    "uid":payload.uid,
    "deviceName":payload.deviceName
    }
  }
  return axios(options)
}

export const randomtest = () => {
  const options = {
    method: 'POST',
    url: 'http://192.168.29.63:8000/test',
  }
  return axios(options)
}
