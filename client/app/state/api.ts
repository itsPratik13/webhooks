import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Endpoint {
  id: number;
  name: string | null;
  token: string;
  provider: "stripe" | "github" | "razorpay";
  createdAt: string;
}
interface WebHookResponse {
  id:number;
  method:string;
  headers:string;
  body:string;
  receivedAt:string;
  ip?:string;
  endpointId:number;

  eventType?: string;
  statusCode?: number;
  processingTime?: number; // in ms
  signatureValid?: boolean;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL ,
    prepareHeaders: async (headers) => {
      try {
        if (typeof window !== "undefined") {
          const token = await window.Clerk?.session?.getToken();
          console.log("Clerk token:", token);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
        }
      } catch (e) {
        console.error("Failed to get Clerk token:", e);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Endpoints"],
  endpoints: (build) => ({
    getEndpoints: build.query<Endpoint[], void>({
      query: () => "/endpoints",
      transformResponse: (response: { data: Endpoint[]; meta: any }) =>
        response.data,
      providesTags: ["Endpoints"],
    }),
    deleteEndpoints: build.mutation<void, number>({
      query: (id) => {
        return {
          url: `/endpoints/${id}`,
          method: "DELETE",
        };
      },

      invalidatesTags: ["Endpoints"],
    }),
    addEndpoints: build.mutation<Endpoint, {name:string,provider:"stripe"|"github"|"razorpay"}>({
      query: (name) => ({
        url: "/endpoints",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Endpoints"],
    }),
    getWebHooks:build.query<WebHookResponse[],number>({
      query:(endpointId)=>({
        url:`/endpoints/${endpointId}/webhooks`,
        transformResponse:(response:WebHookResponse[])=>response,
        method:"GET",
      
      })
      ,providesTags:["Endpoints"]
    })
  }),
  
});

export const {
  useGetEndpointsQuery,
  useDeleteEndpointsMutation,
  useAddEndpointsMutation,
  useGetWebHooksQuery
} = api;
