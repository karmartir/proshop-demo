import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : { cartItems: []};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.totalQuantity += newItem.quantity;
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
