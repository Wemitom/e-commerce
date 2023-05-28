import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ItemData, OrderData } from 'components/Cart/Order';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/orders'
        : '/orders'
  }),
  endpoints: (builder) => ({
    order: builder.mutation<
      { message: string; code: number } | undefined,
      { orderData: OrderData; items: ItemData[] }
    >({
      query: (order) => ({
        url: '',
        method: 'POST',
        body: order
      })
    })
  })
});

export const { useOrderMutation } = orderApi;
