import { useEffect, useRef, useState } from 'react';

import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { AsyncSelect, InputField } from 'components/Cart/Order';
import Button from 'components/common/Button';
import placeholder from 'public/placeholder.png';
import {
  useAddProductMutation,
  useEditProductMutation,
  useGetCategoriesQuery,
  useGetImageQuery
} from 'store/api';

interface EditProps {
  id: number;
  title: string;
  price: number;
  category: string;
}

interface ProductEdit extends EditProps {
  closeModal: () => void;
  edit?: true;
}

interface ProductAdd extends Partial<EditProps> {
  closeModal: () => void;
  edit?: false;
}

type ProductProps = ProductAdd | ProductEdit;

const ProductForm = ({
  edit,
  id,
  title,
  price,
  category,
  closeModal
}: ProductProps) => {
  const { data: image } = useGetImageQuery(id!, { skip: !edit });
  const [imageURL, setImageURL] = useState(image ? image : placeholder);
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
  const [addProduct, { isSuccess: isSuccessAdd, isError: isErrorAdd }] =
    useAddProductMutation();
  const [editProduct, { isSuccess: isSuccessEdit, isError: isErrorEdit }] =
    useEditProductMutation();

  useEffect(() => {
    console.log(isErrorAdd);
    if (isSuccessAdd || isSuccessEdit)
      toast.success(
        isSuccessAdd ? 'Товар успешно добавлен!' : 'Товар отредактирован!',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        }
      );
    else if (isErrorAdd || isErrorEdit)
      toast.error('Возникла ошибка!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
  }, [isSuccessAdd, isErrorAdd, isSuccessEdit, isErrorEdit]);

  return (
    <Formik
      initialValues={{
        title: edit ? title : 'Новый товар',
        price: edit ? price : 10,
        category: edit ? category : '',
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
      onSubmit={(data) => {
        edit
          ? editProduct({
              id,
              ...data,
              price: +data.price,
              image: imageURL.split(',')[1]
            }).then(() => closeModal())
          : addProduct({
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
            {edit ? 'Сохранить' : 'Создать'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
