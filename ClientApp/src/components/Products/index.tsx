import { useEffect } from 'react';

import { useGetProductsQuery } from 'store/api';

import { ReactComponent as Spinner } from '../../public/spinner.svg';
import Product, { ProductType } from './Product';

const Products = ({ search }: { search: string }) => {
  const { data, isLoading, isSuccess } = useGetProductsQuery();

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
      <section className="flex flex-wrap justify-center gap-x-24 gap-y-3 p-12">
        {data
          .filter((product: ProductType) => {
            const searchRegex = new RegExp(`.*${search.toLowerCase()}.*`, 'g');

            return search !== ''
              ? [...product.title.toLowerCase().matchAll(searchRegex)].length >
                  0
              : true;
          })
          .map((product) => (
            <Product key={product.id} {...product} />
          ))}
      </section>
    );
  } else {
    return <></>;
  }
};

export default Products;
