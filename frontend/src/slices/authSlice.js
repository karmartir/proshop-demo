import { createSlice } from '@reduxjs/toolkit';

// Initial state with userInfo from localStorage if available
const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,

};

// Create the auth slice
// This slice manages authentication state, including user info and logout functionality
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    }
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;  