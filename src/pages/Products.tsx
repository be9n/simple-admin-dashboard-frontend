import { Button } from "@/components/ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getProductColumns } from "@/components/tables/ProductColumns";
import Pagination from "@/components/Pagination";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "@/api/products";
import Search from "@/components/tables/Search";
import { Filters } from "@/components/Filters";
import { useFiltersStore } from "@/store/useFiltersStore";
import TableSkeleton from "@/components/TableSkeleton";

export type ProductsQueryParams = {
  search: string;
  page: string;
  sort_by: string;
  sort_dir: string;
  filters: string;
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const { getFormattedFilters } = useFiltersStore();

  const queryParams: ProductsQueryParams = {
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || "",
    sort_by: searchParams.get("sort_by") || "",
    sort_dir: searchParams.get("sort_dir") || "",
    filters: getFormattedFilters(),
  };

  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
    placeholderData: keepPreviousData,
    retry: false,
    gcTime: 0,
  });
  
  const columns = getProductColumns();
  const table = useReactTable({
    data: data?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-red-500">
          Failed to load products. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-3xl font-semibold text-primary-500 dark:text-primary-300 mb-4">
        Products
      </h1>
      <div className="bg-white dark:bg-secondary-600 p-3 rounded-lg">
        <div className="flex justify-between items-center gap-6 mb-5">
          <div className="flex gap-2 items-center">
            <Search />
            <Filters />
          </div>
          <Button asChild>
            <Link to="/products/create">Add Product</Link>
          </Button>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="dark:text-neutral-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="bg-primary-200/40 dark:bg-secondary-500"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-start font-normal px-3 py-2 first:rounded-s-lg last:rounded-e-lg"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-primary-100 dark:hover:bg-secondary-500/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-2 first:rounded-s-lg last:rounded-e-lg"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data?.pagination && (
              <Pagination
                pagination={data.pagination}
                isPlaceholderData={isPlaceholderData}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
