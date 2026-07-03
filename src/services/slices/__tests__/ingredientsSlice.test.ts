import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import { mockIngredients } from './fixtures';

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

describe('ingredientsSlice reducer', () => {
  test('должен вернуть начальное состояние при undefined', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен обработать fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обработать fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  test('должен обработать fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка'), '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
