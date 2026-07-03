import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown
} from '../constructorSlice';
import { mockBun, mockMain, mockSauce } from './fixtures';
import { TConstructorIngredient } from '@utils-types';

const initialState = { bun: null, ingredients: [] };

describe('constructorSlice reducer', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен добавить булку', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun?.type).toBe('bun');
  });

  test('должен заменить булку', () => {
    const firstState = constructorReducer(initialState, addIngredient(mockBun));
    const state = constructorReducer(
      firstState,
      addIngredient({ ...mockBun, _id: '5', name: 'Другая булка' })
    );
    expect(state.bun?.name).toBe('Другая булка');
  });

  test('должен добавить начинку и соус', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);

    const state2 = constructorReducer(initialState, addIngredient(mockSauce));
    expect(state2.ingredients[0].type).toBe('sauce');
  });

  test('должен удалить ингредиент и очистить конструктор', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [{ ...mockMain, id: 'abc' } as TConstructorIngredient]
      },
      removeIngredient('abc')
    );
    expect(state.ingredients).toHaveLength(0);

    const state2 = constructorReducer(
      {
        bun: { ...mockBun, id: 'bun' } as TConstructorIngredient,
        ingredients: []
      },
      clearConstructor()
    );
    expect(state2.bun).toBeNull();
  });

  test('должен корректно перемещать ингредиенты', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'a' } as TConstructorIngredient,
          { ...mockSauce, id: 'b' } as TConstructorIngredient
        ]
      },
      moveIngredientUp(1)
    );
    expect(state.ingredients[0].id).toBe('b');

    const state2 = constructorReducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'a' } as TConstructorIngredient,
          { ...mockSauce, id: 'b' } as TConstructorIngredient
        ]
      },
      moveIngredientDown(0)
    );
    expect(state2.ingredients[0].id).toBe('b');
  });

  test('не должен переместить первый элемент вверх', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'a' } as TConstructorIngredient,
          { ...mockSauce, id: 'b' } as TConstructorIngredient
        ]
      },
      moveIngredientUp(0)
    );
    expect(state.ingredients[0].id).toBe('a');
  });
});
