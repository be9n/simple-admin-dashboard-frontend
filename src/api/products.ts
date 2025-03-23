import { PaginationType, Product } from "@/types";
import API from "@/utils/api";
import { ProductsQueryParams } from "@/pages/Products";
import { ProductFormData } from "@/pages/CreateProduct";
import { serialize } from "object-to-formdata";

export type ProductsResponse = {
  products: Product[];
  pagination: PaginationType;
};

export const getProducts = async (
  queryParams: ProductsQueryParams
): Promise<ProductsResponse> => {
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => value !== "")
  );

  // Convert query params to URL string
  const params = new URLSearchParams(filteredQueryParams).toString();

  const url = `/products?${params}`;

  const { data } = await API.get(url);

  return data.data;
};

export const showProduct = async (id: number) => {
  const url = `/products/${id}`;

  const { data } = await API.get(url);

  return data.data;
};

export const createProduct = async ({ data }: { data: ProductFormData }) => {
  const formData = serialize(data);

  const { data: resData } = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resData;
};

export const updateProduct = async ({
  data,
  id,
}: {
  data: ProductFormData;
  id: number;
}) => {
  const formData = serialize(data);

  const { data: resData } = await API.post(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resData;
};

export const deleteProduct = async (id: number) => {
  const { data } = await API.delete(`/products/${id}`);

  return data;
};
