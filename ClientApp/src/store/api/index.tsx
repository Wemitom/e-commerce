import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ProductType } from 'components/Products/Product';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : ''
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => ({ url: 'items', method: 'GET' })
    }),
    getImage: builder.query<string, number>({
      query: (id: number) => ({
        url: `items/getimage/${id}`,
        method: 'GET',
        responseHandler: async (res) =>
          `data:image/png;base64,${(await res.json()).image}`
      })
    })
  })
});

export const { useGetProductsQuery, useGetImageQuery } = storeApi;
