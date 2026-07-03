import { TIngredient } from '@utils-types';

export const mockBun: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255
} as TIngredient;

export const mockMain: TIngredient = {
  _id: '2',
  name: 'Биокотлета',
  type: 'main',
  price: 424
} as TIngredient;

export const mockSauce: TIngredient = {
  _id: '3',
  name: 'Соус с шипами',
  type: 'sauce',
  price: 88
} as TIngredient;

export const mockIngredients: TIngredient[] = [mockBun, mockMain, mockSauce];
