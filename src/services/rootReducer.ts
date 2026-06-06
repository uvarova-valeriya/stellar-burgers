import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { feedSlice } from './slices/feedSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';

export const rootReducer = combineSlices(
  constructorSlice,
  ingredientsSlice,
  userSlice,
  feedSlice,
  orderSlice
);
