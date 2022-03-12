import axios from 'axios'

export const setUser = (payload) => {
  const options = {
    method: 'POST',
    url: '/api/setuser',
    data: payload
  }
  return axios(options)
}