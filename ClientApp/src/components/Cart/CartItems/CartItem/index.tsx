import { useDispatch } from 'react-redux';

import { Categories } from 'components/Products/Product';
import { changeCount } from 'store/cartSlice';

const CartItem = ({
  id,
  title,
  price,
  image,
  category,
  count,
  selectChosen,
  unselectChosen,
  chosen = false
}: {
  id: number;
  title: string;
  price: number;
  image: string;
  category: Categories;
  count: number;
  selectChosen: (id: number) => void;
  unselectChosen: (id: number) => void;
  chosen?: boolean;
}) => {
  const dispatch = useDispatch();

  return (
    <div className="mb-6 flex flex-row gap-x-6 border-b pb-3 sm:h-28">
      <div className="flex h-full w-5 items-center">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={chosen}
          onChange={() => {
            if (chosen) {
              unselectChosen(id);
            } else {
              selectChosen(id);
            }
          }}
        />
      </div>
      <div
        className="h-24 w-2/12 bg-contain bg-center bg-no-repeat"
        aria-label={title}
        role="img"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="flex w-4/12 flex-col justify-between gap-y-3">
        <span>{title}</span>
        <span
          role="button"
          className="w-fit text-red-600"
          onClick={() => {
            unselectChosen(id);
            dispatch(changeCount({ id, count: 0 }));
          }}
        >
          Delete
        </span>
      </div>
      <span className="w-3/12">{(price * count).toFixed(2)}$</span>
      <div className="w-2/12">
        <input
          type="number"
          className="h-8 w-full rounded-md border border-gray-300 p-2 sm:w-6/12"
          value={count}
          onChange={(e) =>
            +e.target.value > 0 &&
            dispatch(changeCount({ id, count: +e.target.value }))
          }
        />
      </div>
    </div>
  );
};

export default CartItem;
