import { createSlice } from "@reduxjs/toolkit";

// Initial user state
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

// Redux slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // Ensure token is stored
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
