import { useEffect, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';

import Modal from 'components/Modal';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import { RootState } from 'store';
import {
  useDeleteProductMutation,
  useGetProductsQuery
} from 'store/api/storeApi';

import ControlPanel from './ControlPanel';
import Product, { ProductType } from './Product';
import ProductForm from './ProductForm';

const Products = ({ search }: { search: string }) => {
  const { data, isLoading, isSuccess } = useGetProductsQuery();
  const filteredItems = useMemo(
    () =>
      data?.filter((product: ProductType) => {
        const searchRegex = new RegExp(`.*${search.toLowerCase()}.*`, 'g');

        return search !== ''
          ? [...product.title.toLowerCase().matchAll(searchRegex)].length > 0
          : true;
      }),
    [search, data]
  );

  const [editId, setEditId] = useState(0);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const editItem = useMemo(
    () => data?.find((item) => item.id === editId),
    [editId, data]
  );

  const handleEdit = (id: number) => {
    setOpenEditProduct(true);
    setEditId(id);
  };

  const [deleteId, setDeleteId] = useState(0);
  const [open, setOpen] = useState(false);

  const [deleteProduct /*, { isSuccess: isSuccessDelete }*/] =
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
        <div className="flex w-full flex-col justify-between gap-6 px-12 sm:px-16 md:flex-row">
          <h1 className="text-center text-5xl font-bold sm:text-left">
            Товары
          </h1>

          {loggedIn && <ControlPanel />}
        </div>

        <section className="flex flex-wrap justify-center gap-x-24 gap-y-3 p-12">
          {filteredItems && filteredItems.length ? (
            filteredItems.map((product) => (
              <Product
                key={product.id}
                product={product}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))
          ) : (
            <p>Товаров нет</p>
          )}
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

        {loggedIn && editItem && (
          <Modal
            title="Редактировать"
            open={openEditProduct}
            setOpen={setOpenEditProduct}
          >
            <ProductForm
              id={editItem.id}
              title={editItem.title}
              category={editItem.category}
              price={editItem.price}
              image={editItem.image ?? null}
              closeModal={() => setOpenEditProduct(false)}
              edit
            />
          </Modal>
        )}
      </>
    );
  } else {
    return <p>Ошибка подключения к базе данных</p>;
  }
};

export default Products;
