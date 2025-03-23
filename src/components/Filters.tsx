import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesList, ListCategory } from "@/api/categories";
import Spinner from "./Spinner";
import { useFiltersStore } from "@/store/useFiltersStore";
import { useEffect, useState } from "react";
import useQueryParamsUpdater from "@/hooks/useQueryParamsUpdater";

export function Filters() {
  const { resetFilters, filtersExist } = useFiltersStore();

  const { data: categories, isLoading } = useQuery<ListCategory[]>({
    queryKey: ["categories_list"],
    queryFn: getCategoriesList,
    gcTime: 0,
  });

  return (
    <Popover>
      <PopoverTrigger
        asChild
        className="text-secondary-500 dark:text-white dark:hover:bg-secondary-500"
      >
        <Button
          variant="ghost"
          className="bg-secondary-100/40 dark:bg-secondary-400/50 dark:hover:dark:bg-secondary-400 cursor-pointer"
        >
          {filtersExist() ? <VscFilterFilled /> : <VscFilter />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative w-auto min-w-[300px] bg-white dark:bg-secondary-400 border-none text-secondary-500 dark:text-white">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h4 className="font-medium leading-none mb-3">Categories</h4>
            <CategoriesFilter categories={categories} isLoading={isLoading} />
          </div>
        </div>

        {filtersExist() && (
          <X
            size={13}
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => resetFilters()}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function CategoriesFilter({
  categories,
  isLoading,
}: {
  categories: ListCategory[] | undefined;
  isLoading: boolean;
}) {
  const { setFilter, filters, getFormattedFilters } = useFiltersStore();
  const { updateSearchParams } = useQueryParamsUpdater();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    updateSearchParams({ filters: getFormattedFilters() });
  }, [filters]);

  return (
    <Select
      key={Date()}
      onValueChange={(value) => setFilter("category_id", value)}
      value={filters?.["category_id"] as string}
    >
      <SelectTrigger className="w-[180px] border-none bg-secondary-100/30 hover:bg-secondary-100/50 dark:bg-secondary-300 cursor-pointer dark:hover:bg-secondary-300/70 transition-colors duration-200">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="border-none bg-white dark:bg-secondary-400 text-secondary-700 dark:text-secondary-100">
        {isLoading ? (
          <Spinner className="size-5 my-5 mx-auto" />
        ) : (
          <SelectGroup className="text-secondary-100">
            {categories?.map((cat) => (
              <SelectItem
                key={cat.id}
                className="hover:bg-secondary-100/30 text-secondary-500 dark:text-secondary-100 transition-colors duration-200 cursor-pointer"
                value={cat.id.toString()}
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
