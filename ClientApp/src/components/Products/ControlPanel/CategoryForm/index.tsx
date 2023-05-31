import { useEffect } from 'react';

import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { InputField } from 'components/Cart/Order';
import Button from 'components/common/Button';
import { useAddCategoryMutation } from 'store/api';

const CategoryForm = ({ closeModal }: { closeModal: () => void }) => {
  const [addCategory, { isSuccess, isError }] = useAddCategoryMutation();

  useEffect(() => {
    if (isSuccess)
      toast.success('Категория создана', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    else if (isError)
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
  }, [isSuccess, isError]);

  return (
    <Formik
      initialValues={{
        category: ''
      }}
      validationSchema={Yup.object().shape({
        category: Yup.string().required('Требуется для заполнения')
      })}
      onSubmit={(data) => {
        addCategory(data.category).then(() => closeModal());
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex w-full flex-col items-center">
          <InputField
            name="category"
            label="Категория"
            error={
              errors.category && touched.category ? errors.category : undefined
            }
            required
            fullWidth
          />

          <div className="mt-3 inline-flex w-full justify-center">
            <Button handleClick={() => console.log('submit')} submit>
              Создать
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
