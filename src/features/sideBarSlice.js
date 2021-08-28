const initialState = {
  sidebarShow: 'responsive',
  baseUrl: 'http://localhost:4001'
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