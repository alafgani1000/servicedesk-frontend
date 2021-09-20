import axios from "axios"

const dataNotifIncident = () => {
  const Axios = axios.create({
    headers: {
      'token': localStorage.getItem('shitToken'),
      'Content-Type': 'multipart/form-data'
    },
    baseURL:'http://localhost:4001'
  });

  Axios.get('api/notifications/incidents',{

  })
  .then(function(response){
    console.log(response)
    return response
  })
  .catch(function(error){
    return error
  })
}

const initialState = {
  sidebarShow: 'responsive',
  baseUrl: 'http://localhost:4001',
  token: localStorage.getItem('shitToken'),
  role: localStorage.getItem('role'),
  group: localStorage.getItem('group'),
  nama: localStorage.getItem('name'),
  notifIncident: dataNotifIncident,
  incidentSearch:""
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

export default changeState