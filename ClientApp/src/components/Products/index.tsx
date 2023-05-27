import { useEffect, useState } from 'react';

import Modal from 'components/Modal';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useDeleteProductMutation, useGetProductsQuery } from 'store/api';

import { ReactComponent as Spinner } from '../../public/spinner.svg';
import Product, { ProductType } from './Product';

const Products = ({ search }: { search: string }) => {
  const { data, isLoading, isSuccess } = useGetProductsQuery();

  const [deleteId, setDeleteId] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteProduct, { isSuccess: isSuccessDelete }] =
    useDeleteProductMutation();

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const handleDelete = (id: number) => {
    setOpen(true);
    setDeleteId(id);
  };

  useEffect(() => {
    isLoading
      ? (document.body.style.overflowY = 'hidden')
      : (document.body.style.overflowY = 'auto');
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Spinner className="h-12 w-12 animate-spin" />
        Загрузка...
      </div>
    );
  } else if (data && isSuccess) {
    return (
      <>
        <section className="flex flex-wrap justify-center gap-x-24 gap-y-3 p-12">
          {data
            .filter((product: ProductType) => {
              const searchRegex = new RegExp(
                `.*${search.toLowerCase()}.*`,
                'g'
              );

              return search !== ''
                ? [...product.title.toLowerCase().matchAll(searchRegex)]
                    .length > 0
                : true;
            })
            .map((product) => (
              <Product
                key={product.id}
                product={product}
                handleDelete={handleDelete}
              />
            ))}
        </section>

        {loggedIn && (
          <Modal
            open={open}
            setOpen={setOpen}
            title="Подтвердите действие"
            center
          >
            <div className="flex h-36 flex-col justify-between">
              <p className="mt-6">
                Вы уверены что хотите удалить товар с id {deleteId}?
              </p>

              <div className="flex w-full gap-6 [&>button]:grow">
                <button
                  className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
                  onClick={() => setOpen(false)}
                >
                  Нет
                </button>
                <button
                  className="bg-accent hover:bg-accent/90 rounded-lg p-2 text-white"
                  onClick={() => {
                    deleteProduct(deleteId);
                    setOpen(false);
                  }}
                >
                  Да
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default Products;
