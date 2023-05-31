import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type StatsType = [string, number | string][];

export const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3333/stats'
        : '/stats'
  }),
  endpoints: (builder) => ({
    getStats: builder.query<StatsType, void>({
      query: () => ({
        url: 'byCategory',
        method: 'GET',
        responseHandler: async (res) => {
          const data: { label: string; data: number }[] = await res.json(),
            stats: StatsType = [['Категория', 'Сумма']];
          data.forEach((stat) => stats.push([stat.label, stat.data]));
          return stats;
        }
      })
    })
  })
});

export const { useGetStatsQuery } = statsApi;
