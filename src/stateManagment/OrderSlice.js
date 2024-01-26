import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newOrderCount: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setNewOrderCount: (state, action) => {
      state.newOrderCount = action.payload;
    },
  },
});

export const { setNewOrderCount } = orderSlice.actions;
export const selectNewOrderCount = (state) => state.order.newOrderCount;
export default orderSlice.reducer;
