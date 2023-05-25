import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'store';
import { classNames } from 'utils';

import CartItems from './CartItems';

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

  useEffect(() => {
    const main = document.getElementsByTagName('main')[0];
    main.style.flexDirection = 'column';
    main.style.alignItems = 'center';

    return () => {
      main.style.flexDirection = 'row';
      main.style.alignItems = 'unset';
    };
  });

  return (
    <div className="w-11/12">
      <p className="mb-5 w-full text-4xl font-bold">{`Cart${
        cartCount ? '' : ' is empty'
      }`}</p>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-full sm:w-8/12">
          {cartCount === 0 && (
            <p className="mt-3 text-xl">
              Try using the search bar if you can`t find the items you are
              looking for!
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
                Order selected items
              </button>
            </div>
            <div className="mb-6 p-3">
              <h3 className="mb-3 text-xl font-bold">Selected items cost</h3>
              <p className="flex justify-between">
                <span>
                  Items (
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
                  $
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
