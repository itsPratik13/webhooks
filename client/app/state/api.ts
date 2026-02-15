import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Endpoint {
  id: number;
  name: string | null;
  token: string;
  createdAt: string;
}
interface EndpointsResponse {
  data: Endpoint[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  reducerPath: "api",
  tagTypes: ["Endpoints"],
  endpoints: (build) => ({
    getEndpoints: build.query<Endpoint[],void>({
      query: () => "/endpoints",
      transformResponse:(response:{data:Endpoint[]; meta:any})=>response.data,
      providesTags: ["Endpoints"],
    }),
  }),
});

export const { useGetEndpointsQuery } = api;
