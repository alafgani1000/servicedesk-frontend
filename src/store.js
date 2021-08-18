import sideBarSlice from "./features/sideBarSlice"
import { createStore,  } from 'redux'

const store = createStore(sideBarSlice)
export default store

