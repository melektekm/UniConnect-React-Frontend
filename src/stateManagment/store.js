import React from 'react'; 
import { configureStore } from '@reduxjs/toolkit'
import OrderSlice from './OrderSlice';

const store = configureStore({
    reducer: {
        order : OrderSlice
    }
})

export default store