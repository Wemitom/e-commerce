import { useDispatch, useSelector } from 'react-redux';

import placeholder from 'public/placeholder.png';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import { RootState, useAppDispatch } from 'store';
import { useGetImageQuery } from 'store/api';
import { addToCart, changeCount } from 'store/cartSlice';

export type ProductType = {
  id: number;
  title: string;
  price: number;
  category: string;
};

const ChangeAmtBtn = ({
  product,
  add = false
}: {
  product: ProductType;
  add?: boolean;
}) => {
  const dispatch = useDispatch();
  const count = useSelector(
    (state: RootState) =>
      state.cart.items.filter((item) => item.item.id === product.id)[0].count
  );

  return (
    <div className="flex w-2/12 justify-center align-middle">
      <button
        onClick={() =>
          add
            ? dispatch(changeCount({ id: product.id, count: count + 1 }))
            : dispatch(changeCount({ id: product.id, count: count - 1 }))
        }
        className="text-3xl hover:text-black/60 active:text-2xl "
      >
        {add ? '+' : '-'}
      </button>
    </div>
  );
};

const Product = ({
  product: { id, title, price, category },
  handleDelete,
  handleEdit
}: {
  product: ProductType;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
}) => {
  const items = useSelector(
    (state: RootState) =>
      state.cart.items.filter((item) => item.item.id === id)[0]
  );
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const { data: image, isLoading } = useGetImageQuery(id);
  const dispatch = useAppDispatch();
  const inCart = items?.count > 0;

  return (
    <>
      <div className="relative h-80 w-48">
        {loggedIn && (
          <button
            className="[&>div]:hover:bg-accent/80 absolute top-0 w-full"
            onClick={() => handleDelete(id)}
          >
            <div className="bg-accent absolute right-0 h-[2px] w-4 rotate-45 transition-colors duration-300" />
            <div className="bg-accent absolute right-0 h-[2px] w-4 -rotate-45 transition-colors duration-300" />
          </button>
        )}
        {isLoading ? (
          <div className="flex h-44 w-48 items-center justify-center">
            <Spinner className="h-12 w-12 animate-spin" />
          </div>
        ) : (
          <div
            className="h-44 w-48 bg-contain bg-center bg-no-repeat"
            aria-label={title}
            role="img"
            style={{
              backgroundImage: `url(${image ? image : placeholder})`
            }}
          />
        )}
        <p className="mt-3 text-lg">{price}₽</p>
        <h3
          className="h-12 overflow-hidden text-ellipsis"
          style={{
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical'
          }}
        >
          {title}
        </h3>
        <div className="mt-3 flex w-full justify-center">
          {!loggedIn ? (
            !inCart ? (
              <button
                className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
                onClick={() =>
                  dispatch(
                    addToCart({
                      id,
                      title,
                      price,
                      category
                    })
                  )
                }
              >
                Добавить в корзину
              </button>
            ) : (
              <div className="flex w-3/4 flex-row justify-center gap-3">
                <ChangeAmtBtn product={{ id, title, price, category }} />
                <input
                  type="number"
                  className="w-8/12 appearance-none text-center"
                  min={1}
                  onChange={(e) =>
                    dispatch(
                      changeCount({
                        id,
                        count: +e.target.value
                      })
                    )
                  }
                  value={items?.count || 0}
                />
                <ChangeAmtBtn product={{ id, title, price, category }} add />
              </div>
            )
          ) : (
            <button
              className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
              onClick={() => handleEdit(id)}
            >
              Редактировать
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
