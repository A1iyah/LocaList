import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "../utils/playerSlice";

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

export default store;
