import { useEffect, useMemo, useRef, useState } from 'react';

import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { AsyncSelect, InputField } from 'components/Cart/Order';
import Button from 'components/common/Button';
import Modal from 'components/Modal';
import placeholder from 'public/placeholder.png';
import { ReactComponent as Spinner } from 'public/spinner.svg';
import { RootState } from 'store';
import { useGetCategoriesQuery } from 'store/api/categoriesApi';
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery
} from 'store/api/storeApi';

import Product, { ProductType } from './Product';

const AddProductForm = ({ closeModal }: { closeModal: () => void }) => {
  const [imageURL, setImageURL] = useState(`${placeholder}`);
  const reader = useRef(new FileReader());
  useEffect(() => {
    reader.current.onload = () => setImageURL(reader.current.result as string);

    const preventDefault = (e: DragEvent) => e.preventDefault();
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);

    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);

  const { data, isLoading } = useGetCategoriesQuery();
  const [addProduct] = useAddProductMutation();

  return (
    <Formik
      initialValues={{
        title: 'Новый товар',
        price: 10,
        category: '',
        image: null
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .min(2, 'Слишком короткое название!')
          .max(50, 'Слишком длинное название!')
          .required('Требуется для заполнения'),
        price: Yup.number()
          .min(10, 'Слишком маленькая цена')
          .max(500000, 'Слишком большая цена!')
          .required('Требуется для заполнения'),
        image: Yup.mixed().test(
          'imageSize',
          'Размер картинки слишком большой!',
          (file: File) => {
            if (!file) return true;
            return file.size < 5e7;
          }
        ),
        category: Yup.string()
          .not([''], 'Выберите категорию')
          .required('Требуется для заполнения')
      })}
      onSubmit={async (data) => {
        addProduct({
          ...data,
          price: +data.price,
          image: imageURL.split(',')[1]
        }).then(() => closeModal());
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className="flex w-full flex-col items-center">
          <InputField
            error={errors.title && touched.title ? errors.title : undefined}
            label="Название"
            name="title"
            required
            fullWidth
          />
          <InputField
            error={errors.price && touched.price ? errors.price : undefined}
            label="Цена"
            name="price"
            required
            fullWidth
          />

          <div
            className="flex w-full flex-col items-center"
            onDrop={(e) => {
              if (e.dataTransfer.files[0].type.startsWith('image')) {
                setFieldValue('image', e.dataTransfer.files[0]);
                reader.current.readAsDataURL(e.dataTransfer.files[0]);
              }
            }}
          >
            <h3 className="ml-1 mb-1 w-full font-bold">Картинка</h3>
            {imageURL && <img src={imageURL} className="mb-6 h-44" />}
            <label
              htmlFor="upload-image"
              className="bg-accent hover:bg-accent/90 flex h-12 cursor-pointer items-center rounded-md px-3 text-white transition-colors duration-200"
            >
              <input
                name="image"
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    setFieldValue('image', e.currentTarget.files[0]);
                    reader.current.readAsDataURL(e.currentTarget.files[0]);
                  }
                }}
              />
              Добавить картинку
            </label>
            {errors.image && touched.image && (
              <p className="text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          <div className="mb-12 w-full">
            <AsyncSelect
              error={
                errors.category && touched.category
                  ? errors.category
                  : undefined
              }
              name="category"
              label="Категория"
              loading={isLoading}
              options={data ?? []}
            />
          </div>

          <Button handleClick={() => console.log('submited')} submit>
            Создать
          </Button>
        </Form>
      )}
    </Formik>
  );
};

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

  const [deleteId, setDeleteId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAddProduct, setOpenAddProduct] = useState(false);
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
        <div className="flex w-full flex-col justify-between gap-6 px-12 sm:flex-row sm:px-16">
          <h1 className="text-center text-5xl font-bold sm:text-left">
            Товары
          </h1>

          <button
            className="bg-accent hover:bg-accent/90 flex h-12 cursor-pointer items-center gap-3 rounded-md px-3 text-white transition-colors duration-200"
            onClick={() => setOpenAddProduct(true)}
          >
            <span className="text-2xl">+</span> Добавить товар
          </button>
        </div>

        <section className="flex flex-wrap justify-center gap-x-24 gap-y-3 p-12">
          {filteredItems && filteredItems.length ? (
            filteredItems.map((product) => (
              <Product
                key={product.id}
                product={product}
                handleDelete={handleDelete}
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

        <Modal
          title="Новый товар"
          open={openAddProduct}
          setOpen={setOpenAddProduct}
        >
          <AddProductForm closeModal={() => setOpenAddProduct(false)} />
        </Modal>
      </>
    );
  } else {
    return <p>Ошибка подключения к базе данных</p>;
  }
};

export default Products;
