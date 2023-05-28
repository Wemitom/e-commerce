import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/categories'
        : '/categories'
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<string[], void>({
      query: () => ({ url: '', method: 'GET' }),
      providesTags: ['Categories']
    })
  })
});

export const { useGetCategoriesQuery } = categoriesApi;
