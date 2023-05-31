import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ItemData, OrderData } from 'components/Cart/Order';
import { ProductType } from 'components/Products/Product';

export type StatsType = [string, number | string][];

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333'
        : '/'
  }),
  tagTypes: ['Products', 'Images', 'Categories'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => ({ url: 'items', method: 'GET' }),
      providesTags: ['Products']
    }),
    addProduct: builder.mutation<
      { message: string; code: number } | undefined,
      Omit<ProductType & { image: string }, 'id'>
    >({
      query: (product) => ({
        url: 'items',
        method: 'POST',
        body: product
      }),
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products', 'Images'] : []
    }),
    getImage: builder.query<string, number>({
      query: (id: number) => ({
        url: `items/getimage/${id}`,
        method: 'GET',
        responseHandler: async (res) => {
          const { image } = await res.json();
          return image ? `data:image/png;base64,${image}` : image;
        },
        providesTags: ['Images']
      })
    }),
    deleteProduct: builder.mutation<
      { message: string; code: number } | undefined,
      number
    >({
      query: (id: number) => ({
        url: `items/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products', 'Images'] : []
    }),
    editProduct: builder.mutation<
      { message: string; code: number } | undefined,
      ProductType & { image: string }
    >({
      query: (product) => ({
        url: `items/${product.id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: (result, error) =>
        !result && !error ? ['Products'] : []
    }),
    getCategories: builder.query<string[], void>({
      query: () => ({ url: 'categories', method: 'GET' }),
      providesTags: ['Categories']
    }),
    getStats: builder.query<StatsType, void>({
      query: () => ({
        url: 'stats/byCategory',
        method: 'GET',
        responseHandler: async (res) => {
          const data: { label: string; data: number }[] = await res.json(),
            stats: StatsType = [['Категория', 'Сумма']];
          data.forEach((stat) => stats.push([stat.label, stat.data]));
          return stats;
        }
      })
    }),
    order: builder.mutation<
      { message: string; code: number } | undefined,
      { orderData: OrderData; items: ItemData[] }
    >({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      })
    })
  })
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetImageQuery,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCategoriesQuery,
  useGetStatsQuery,
  useOrderMutation
} = storeApi;
