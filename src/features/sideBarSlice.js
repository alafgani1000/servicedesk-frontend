const initialState = {
  sidebarShow: 'responsive',
  baseUrl: 'http://localhost:4001',
  token: localStorage.getItem('shitToken'),
  role: localStorage.getItem('role'),
  group: localStorage.getItem('group'),
  nama: localStorage.getItem('name')
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