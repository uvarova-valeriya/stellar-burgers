import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

import { getIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber, getOrders } from '../../services/slices/feedSlice';
import { getUserOrders } from '../../services/slices/userSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  const feedOrders = useSelector(getOrders);
  const userOrders = useSelector(getUserOrders);
  const dispatch = useDispatch();
  const orderData: TOrder | undefined = [...feedOrders, ...userOrders].find(
    (order) => order.number === Number(number)
  );

  const ingredients: TIngredient[] = useSelector(getIngredients);

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
