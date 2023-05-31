import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CartItems from './CartItems';
import { RootState } from '../../store';
import { classNames } from '../../utils';

const Cart = () => {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.count, 0)
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [chosenItemsId, setChosenItemsId] = useState(
    cartItems.map((cartItem) => cartItem.item.id)
  );

  const navigate = useNavigate();

  const chosenItems = cartItems.filter((cartItem) =>
    chosenItemsId.includes(cartItem.item.id)
  );

  return (
    <div className="w-11/12">
      <p className="mb-5 w-full text-4xl font-bold">{`Корзина${
        cartCount ? '' : ' пуста'
      }`}</p>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-full sm:w-8/12">
          {cartCount === 0 && (
            <p className="mt-3 text-xl">
              Используйте поиск, если не можете найти те товары, которые вы
              ищите!
            </p>
          )}
          {cartCount > 0 && (
            <CartItems
              chosenItems={chosenItemsId}
              setChosenItems={setChosenItemsId}
            />
          )}
        </div>
        {cartCount > 0 && (
          <div className="mb-6 flex h-fit w-full flex-col rounded-md bg-slate-100 sm:w-4/12">
            <div className="mb-6 flex justify-center border-b p-6">
              <button
                className={classNames(
                  'h-12 w-11/12 rounded-md transition-colors duration-200',
                  chosenItemsId.length
                    ? 'bg-accent text-white cursor-pointer hover:bg-accent/90'
                    : 'bg-slate-300 text-slate-500 cursor-default'
                )}
                disabled={!chosenItemsId.length}
                onClick={() =>
                  navigate('order', {
                    state: {
                      orderedItems: chosenItems
                    }
                  })
                }
              >
                Заказать выбранные товары
              </button>
            </div>
            <div className="mb-6 p-3">
              <h3 className="mb-3 text-xl font-bold">
                Стоимость выбранных товаров
              </h3>
              <p className="flex justify-between">
                <span>
                  Товары (
                  {chosenItems.reduce(
                    (count, cartItem) => count + cartItem.count,
                    0
                  )}
                  )
                </span>
                <span className="font-bold">
                  {chosenItems
                    .reduce(
                      (cost, cartItem) =>
                        cost + cartItem.item.price * cartItem.count,
                      0
                    )
                    .toFixed(2)}
                  ₽
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
