import { create } from "zustand";

type FilterValue = string | number | boolean | undefined;

type FiltersState = {
  filters?: Record<string, FilterValue | undefined>;
  setFilter: (key: string, value: FilterValue) => void;
  removeFilter: (key: string) => void;
  resetFilters: () => void;
  getFormattedFilters: () => string;
  filtersExist: () => boolean;
};

export const useFiltersStore = create<FiltersState>((set, get) => {
  const filtersFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const filtersParam = searchParams.get("filters");
    if (!filtersParam) return undefined;

    return filtersParam.split(";").reduce((acc, filter) => {
      const [key, value] = filter.split(":");
      return key && value ? { ...acc, [key]: value } : acc;
    }, {} as Record<string, FilterValue>);
  };

  return {
    filters: filtersFromUrl(),

    setFilter: (key, value) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      })),

    removeFilter: (key) =>
      set((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[key];

        return {
          filters: newFilters,
        };
      }),

    resetFilters: () => set({ filters: undefined }),

    getFormattedFilters: () => {
      const filters = get().filters || {};
      return Object.entries(filters)
        .map(([key, value]) => `${key}:${value}`)
        .join(";");
    },

    filtersExist: () => {
      return Object.keys(get().filters || {}).length > 0;
    },
  };
});
