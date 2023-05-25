import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as Spinner } from 'public/spinner.svg';
import { RootState } from 'store';
import { useGetImageQuery } from 'store/api';
import { addToCart, changeCount } from 'store/cartSlice';

export type Categories =
  | 'electronics'
  | 'jewelery'
  | "men's clothing"
  | "women's clothing";

export type ProductType = {
  id: number;
  title: string;
  price: number;
  image?: string;
  category: Categories;
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

const Product = ({ id, title, price, category }: ProductType) => {
  const items = useSelector(
    (state: RootState) =>
      state.cart.items.filter((item) => item.item.id === id)[0]
  );
  const { data, isLoading } = useGetImageQuery(id);
  const [image, setImage] = useState(data ?? '');
  const dispatch = useDispatch();
  const inCart = items?.count > 0;

  useEffect(() => {
    setImage(data ?? '');
  }, [data]);

  return (
    <div className="h-80 w-48">
      <div
        className="h-44 w-48 bg-contain bg-center bg-no-repeat"
        aria-label={title}
        role="img"
        style={{
          backgroundImage: `url(${image ? image : '/Placeholder.png'})`
        }}
      />
      <p className="mt-3 text-lg">{price}$</p>
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
        {!inCart ? (
          <button
            className="rounded-lg bg-accent p-2 text-white hover:bg-accent/90"
            onClick={() =>
              dispatch(
                addToCart({
                  id,
                  title,
                  price,
                  image,
                  category
                })
              )
            }
          >
            Добавить в корзину
          </button>
        ) : (
          <div className="flex w-3/4 flex-row justify-center gap-3">
            <ChangeAmtBtn product={{ id, title, price, image, category }} />
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
            <ChangeAmtBtn product={{ id, title, price, image, category }} add />
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
