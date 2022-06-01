import axios from 'axios'

export const getPower = (payload) => {
  const options = {
    method: 'GET',
    url: 'https://smartenergyconservation-default-rtdb.asia-southeast1.firebasedatabase.app/42/devices/esp1/power.json?auth=ni6lsLkaZzWgTqlPLRSraeO0lxWv6BwZ89Asy72n'
  }
  return axios(options)
}