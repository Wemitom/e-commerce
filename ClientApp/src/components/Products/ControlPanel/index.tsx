import { useEffect, useRef, useState } from 'react';

import Modal from 'components/Modal';
import { useAddProductMutation } from 'store/api';
import { classNames, threeStateBool } from 'utils';

import { ProductType } from '../Product';
import ProductForm from '../ProductForm';

const ControlPanel = () => {
  const [show, setShow] = useState<boolean | null>(null);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [addProduct] = useAddProductMutation();

  const handleAddExamples = async () => {
    const examples: Omit<ProductType & { image: string }, 'id'>[] = await (
      await fetch('data/examples.json')
    ).json();

    Promise.all(examples.map((example) => addProduct(example)));
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
            'flex gap-3 sm:flex-row flex-col',
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
    </>
  );
};

export default ControlPanel;
