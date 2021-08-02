import { configureStore } from "@reduxjs/toolkit";
import urlSlice from "./features/urlSlice";


export default configureStore({
  reducer: {
    url:urlSlice
  }
})