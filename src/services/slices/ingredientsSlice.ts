import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
// import { stat } from 'fs';

interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.items,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getBuns: (state) => state.items.filter((item) => item.type === 'bun'),
    getMains: (state) => state.items.filter((item) => item.type === 'main'),
    getSauces: (state) => state.items.filter((item) => item.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const {
  getIngredients,
  getIsLoading,
  getError,
  getBuns,
  getMains,
  getSauces
} = ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
