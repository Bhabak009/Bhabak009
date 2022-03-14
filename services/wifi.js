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
    headers: payload
  }
  return axios(options)
}
