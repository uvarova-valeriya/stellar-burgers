import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { feedSlice } from './slices/feedSlice';
import { constructorSlice } from './slices/constructorSlice';

export const rootReducer = combineSlices(
  constructorSlice,
  ingredientsSlice,
  userSlice,
  feedSlice
);
