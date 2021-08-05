import { configureStore } from "@reduxjs/toolkit"
import { createStore } from 'redux'
import urlSlice from "./features/urlSlice"

const initialState = {
  sidebarShow: 'responsice'
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch(type) {
    case 'set':
      return {...state, ...rest}
    default:
      return state
  }
}
export default configureStore({
  reducer: {
    url:urlSlice
  }
})