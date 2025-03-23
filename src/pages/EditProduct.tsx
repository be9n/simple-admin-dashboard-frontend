import { showProduct } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import CreateProduct from "./CreateProduct";

export default function EditProduct() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => showProduct(Number(id)),
    gcTime: 0,
  });

  return <CreateProduct editProductData={data?.product} isLoading={isLoading} />;
}
