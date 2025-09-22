import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5
    }),
    getProductDetails: builder.query({
      query: (ProductId) => ({
        url: `${PRODUCTS_URL}/${ProductId}`,
      }),
      keepUnusedDataFor: 5
    }),
      createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    // updateProduct: builder.mutation({
    //   query: (product) => ({
    //     url: `${PRODUCTS_URL}/${product._id}`,
    //     method: "PUT",
    //     body: product,
    //   }),
    // }),
    // deleteProduct: builder.mutation({
    //   query: (ProductId) => ({
    //     url: `${PRODUCTS_URL}/${ProductId}`,
    //     method: "DELETE",
    //   }),
    // }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation } = productsApiSlice;
