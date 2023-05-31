import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import Modal from 'components/Modal';
import Dialog from 'components/Modal/Dialog';
import Dropdown from 'components/Products/ControlPanel/Dropdown';
import {
  useAddCategoryMutation,
  useAddProductMutation,
  useDeleteCategoryMutation
} from 'store/api';
import { classNames, threeStateBool } from 'utils';

import { ProductType } from '../Product';
import ProductForm from '../ProductForm';
import CategoryForm from './CategoryForm';

const ControlPanel = () => {
  const [show, setShow] = useState<boolean | null>(null);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [addProduct] = useAddProductMutation();
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [addCategory] = useAddCategoryMutation();

  const [openDeleteCategory, setOpenDeleteCategory] = useState(false);
  const [category, setCategory] = useState('');
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleAddExamples = async () => {
    const examples: {
      categories: string[];
      items: Omit<ProductType & { image: string }, 'id'>[];
    } = await (await fetch('data/examples.json')).json();

    await Promise.all(
      examples.categories.map((example) => deleteCategory(example))
    );
    await Promise.all(
      examples.categories.map((example) => addCategory(example))
    );

    Promise.all(examples.items.map((example) => addProduct(example))).then(
      () =>
        toast.success('Товары успешно добавлены!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        }),
      () =>
        toast.error('Возникла ошибка!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
    );
  };

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let tm: NodeJS.Timeout;
    if (show && ref) {
      document.body.classList.add('overflow-hidden');
      tm = setTimeout(
        () => document.body.classList.remove('overflow-hidden'),
        300
      );
      ref.current?.classList.remove('hidden');
      ref.current?.classList.add('flex');
    } else if (!show && ref) {
      document.body.classList.add('overflow-hidden');
      tm = setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        ref.current?.classList.add('hidden');
        ref.current?.classList.remove('flex');
      }, 300);
    }

    return () => {
      clearTimeout(tm);
    };
  }, [show]);

  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row">
        <div
          ref={ref}
          className={classNames(
            'flex gap-3 sm:flex-row flex-col relative z-[5]',
            threeStateBool(
              show,
              'md:animate-slide-left animate-slide-bottom',
              'md:animate-slide-right animate-slide-top',
              'hidden'
            )
          )}
        >
          <button
            className="bg-accent hover:bg-accent/90 flex h-12 cursor-pointer items-center justify-center gap-3 rounded-md px-3 text-white transition-colors duration-200"
            onClick={() => handleAddExamples()}
          >
            Добавить пример продуктов
          </button>

          <button
            className="bg-accent hover:bg-accent/90 flex h-12 cursor-pointer items-center justify-center gap-3 rounded-md px-3 text-white transition-colors duration-200"
            onClick={() => setOpenAddProduct(true)}
          >
            <span className="text-2xl">+</span> Добавить товар
          </button>

          <Dropdown
            handleAdd={() => setOpenAddCategory(true)}
            handleDelete={(val) => {
              setOpenDeleteCategory(true);
              setCategory(val);
            }}
          />
        </div>

        <button
          className="flex items-center justify-center gap-3 sm:justify-start"
          onClick={() => setShow(!show)}
        >
          Меню
          <div className="flex flex-col items-center gap-1">
            <span
              className={classNames(
                'h-1 w-8 rounded-md bg-black',
                threeStateBool(
                  show,
                  'animate-cross-top',
                  'animate-burger-top',
                  ''
                )
              )}
            />
            <span
              className={classNames(
                'h-1 w-8 rounded-md bg-black',
                threeStateBool(
                  show,
                  'animate-cross-middle',
                  'animate-burger-middle',
                  ''
                )
              )}
            />
            <span
              className={classNames(
                'h-1 w-8 rounded-md bg-black',
                threeStateBool(
                  show,
                  'animate-cross-bottom',
                  'animate-burger-bottom',
                  ''
                )
              )}
            />
          </div>
        </button>
      </div>

      <Modal
        title="Новый товар"
        open={openAddProduct}
        setOpen={setOpenAddProduct}
      >
        <ProductForm closeModal={() => setOpenAddProduct(false)} />
      </Modal>

      <Modal
        title="Новая категория"
        open={openAddCategory}
        setOpen={setOpenAddCategory}
      >
        <CategoryForm closeModal={() => setOpenAddCategory(false)} />
      </Modal>

      <Dialog
        open={openDeleteCategory}
        setOpen={setOpenDeleteCategory}
        title="Подтвердите действие"
        question={`Вы уверены что хотите удалить категорию ${category}? Это приведет к удалению всех продуктов этой категории!`}
        handleYes={() => deleteCategory(category)}
      />
    </>
  );
};

export default ControlPanel;
