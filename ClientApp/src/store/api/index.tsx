import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProductType } from 'components/Products/Product';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/items'
        : '/items'
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => ({ url: '', method: 'GET' })
    }),
    getImage: builder.query<string, number>({
      query: (id: number) => ({
        url: `getimage/${id}`,
        method: 'GET',
        responseHandler: async (res) => {
          const { image } = await res.json();
          image ? `data:image/png;base64,${image}` : image;
        }
      })
    }),
    deleteProduct: builder.mutation<
      { message: string; code: number } | undefined,
      number
    >({
      query: (id: number) => ({
        url: `${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Products', id }]
    })
  })
});

export const {
  useGetProductsQuery,
  useGetImageQuery,
  useDeleteProductMutation
} = storeApi;
