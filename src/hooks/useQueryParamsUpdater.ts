import { useSearchParams } from "react-router-dom";

export default function useQueryParamsUpdater() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (
    updates: Record<string, string | null>,
    resetPage = true
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (resetPage) params.delete("page");

    setSearchParams(params);
  };

  const removeSearchParams = (keys: string[], resetPage = true) => {
    const params = new URLSearchParams(searchParams);

    keys.map((key) => params.delete(key));

    if (resetPage) params.delete("page");
    setSearchParams(params);
  };

  return { updateSearchParams, removeSearchParams };
}
