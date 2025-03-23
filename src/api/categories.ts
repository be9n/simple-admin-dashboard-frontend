import API from "@/utils/api";

export type ListCategory = {
  id: number;
  name: string;
};

export const getCategoriesList = async (): Promise<ListCategory[]> => {
  const { data } = await API.get("/categories_list");

  return data.data.categories_list;
};
