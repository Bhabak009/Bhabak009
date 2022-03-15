import axios from 'axios'

export const getPower = (payload) => {
  const options = {
    method: 'GET',
    url: 'https://smartenergyconservation-default-rtdb.asia-southeast1.firebasedatabase.app/UsersData/node1.json'
  }
  return axios(options)
}