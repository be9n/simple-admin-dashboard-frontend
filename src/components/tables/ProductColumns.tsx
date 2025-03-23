import { Button } from "@/components/ui/button";
import { ApiError, Category, Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Spinner from "../Spinner";
import { deleteProduct, ProductsResponse } from "@/api/products";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import useQueryParamsUpdater from "@/hooks/useQueryParamsUpdater";
import { toast } from "sonner";
import { useState } from "react";
import DeleteConfirmDialog from "../DeleteConfirmDialog";

export const getProductColumns = (): ColumnDef<Product>[] => {
  return [
    {
      accessorKey: "id",
      header: () => <SortableColumn sortableKey="id" title="ID" />,
      cell: (props) => props.getValue(),
    },
    {
      accessorKey: "name",
      header: () => <SortableColumn sortableKey="name" title="Name" />,
      cell: (props) => props.getValue(),
    },
    {
      accessorKey: "price",
      header: () => <SortableColumn sortableKey="price" title="Price" />,
      cell: (props) => <p>{props.getValue() as number}$</p>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (props) => (props.getValue() as Category).name,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex gap-2">
            <EditAction product={product} />
            <DeleteAction product={product} />
          </div>
        );
      },
    },
  ];
};

const SortableColumn = ({
  sortableKey,
  title,
}: {
  sortableKey: string;
  title: string;
}) => {
  const { updateSearchParams, removeSearchParams } = useQueryParamsUpdater();

  const searchParams = useSearchParams()[0];

  const sort_by = searchParams.get("sort_by");
  const sort_dir = searchParams.get("sort_dir");

  const toggleSortDir = () => {
    if (sort_by === sortableKey) {
      if (sort_dir === "asc") {
        updateSearchParams({ sort_dir: "desc" });
      } else {
        removeSearchParams(["sort_by", "sort_dir"]);
      }
    } else {
      updateSearchParams({ sort_by: sortableKey, sort_dir: "asc" });
    }
  };

  return (
    <div
      onClick={toggleSortDir}
      className="group relative flex items-center cursor-pointer"
    >
      <ArrowUp
        size={13}
        className={`text-secondary-500 dark:text-secondary-100 absolute ${
          sort_by === sortableKey && sort_dir === "asc"
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />
      <ArrowDown
        size={13}
        className={`text-secondary-500 dark:text-secondary-100 absolute ${
          sort_by === sortableKey && sort_dir === "desc"
            ? "opacity-100"
            : "opacity-0"
        }`}
      />
      <p className="ps-4">{title}</p>
    </div>
  );
};

const DeleteAction = ({ product }: { product: Product }) => {
  const queryClient = useQueryClient();
  const [recordToDelete, setRecordToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_data, id) => {
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ["products"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            products: oldData.products.filter((p: Product) => p.id !== id),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = async () => {
    if (!recordToDelete) return; // Unneeded but it might be useful in another situation

    const deleteMutationPromise = deleteMutation.mutateAsync(product.id);

    toast.promise(deleteMutationPromise, {
      loading: "Deleting product...",
      success: (res) => res.message || "Product created successfully!",
      error: (error: ApiError) => error.message || "Something went wrong!",
    });

    await deleteMutationPromise;
  };

  return (
    <DeleteConfirmDialog onConfirm={handleDelete}>
      <Button
        variant="default"
        disabled={deleteMutation.isPending}
        onClick={() => setRecordToDelete({ id: 123, name: "Sample Record" })}
        className="text-sm min-w-[75px] bg-red-400 hover:bg-red-500"
      >
        {deleteMutation.isPending ? <Spinner /> : "Delete"}
      </Button>
    </DeleteConfirmDialog>
  );
};

const EditAction = ({ product }: { product: Product }) => {
  return (
    <Button asChild className="bg-secondary-300 hover:bg-secondary-400">
      <Link to={`/products/edit/${product.id}`}>Edit</Link>
    </Button>
  );
};
