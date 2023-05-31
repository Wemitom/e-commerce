import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ProductType } from 'components/Products/Product';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/items'
        : '/items'
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => ({ url: '', method: 'GET' }),
      providesTags: ['Products']
    }),
    addProduct: builder.mutation<
      { message: string; code: number } | undefined,
      Omit<ProductType, 'id'>
    >({
      query: (product) => ({
        url: '',
        method: 'POST',
        body: product
      }),
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products'] : []
    }),
    getImage: builder.query<string, number>({
      query: (id: number) => ({
        url: `getimage/${id}`,
        method: 'GET',
        responseHandler: async (res) => {
          const { image } = await res.json();
          return image ? `data:image/png;base64,${image}` : image;
        },
        providesTags: ['Products']
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
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products'] : []
    }),
    editProduct: builder.mutation<
      { message: string; code: number } | undefined,
      ProductType
    >({
      query: (product) => ({
        url: `${product.id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products'] : []
    })
  })
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetImageQuery,
  useDeleteProductMutation,
  useEditProductMutation
} = storeApi;
