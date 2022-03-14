const https = require('https');
const axios = require('axios')
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});
const agent = new https.Agent({  
  rejectUnauthorized: false
});
export const scanWifi = (payload) => {
  const options = {
    method: 'POST',
    url: 'http://192.168.4.1/scan',
    httpsAgent: agent
  }
  return axios(options)
}
export const setUserId = (payload) => {
  const options = {
    method: 'POST',
    url: 'http://192.168.4.1/setuid',
    header: payload,
    httpsAgent: agent,
  }
  return axios(options)
}

export const setSsid = (payload) => {
  const options = {
    method: 'POST',
    url: 'http://192.168.4.1/setuid',
    header: payload,
    httpsAgent: agent
  }
  return axios(options)
}
