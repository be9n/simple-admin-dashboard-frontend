import useQueryParamsUpdater from "@/hooks/useQueryParamsUpdater";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams()[0];
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const { updateSearchParams } = useQueryParamsUpdater();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    updateSearchParams({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <input
        type="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder="Search for products"
        className="bg-secondary-100/50 dark:bg-secondary-500 dark:placeholder:text-neutral-300 dark:text-neutral-300 outline-none p-2 ps-7 rounded-lg min-w-80"
      />
      <SearchIcon className="absolute start-1 top-1/2 -translate-y-1/2 size-5 text-neutral-400 dark:text-neutral-300" />
    </div>
  );
}
