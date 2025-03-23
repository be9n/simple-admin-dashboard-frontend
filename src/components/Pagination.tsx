import { Button } from "@/components/ui/button";
import useQueryParamsUpdater from "@/hooks/useQueryParamsUpdater";
import { PaginationType } from "@/types";

export const FIRST_PAGE = "1";

type PaginationProps = {
  pagination: PaginationType;
  isPlaceholderData: boolean;
};

const Pagination = ({
  pagination: {
    current_page,
    last_page,
    has_next_page,
    has_prev_page,
    has_pages,
  },
  isPlaceholderData,
}: PaginationProps) => {
  const { updateSearchParams } = useQueryParamsUpdater();

  const handlePageClick = (page: number) => {
    if (page < 1 || page > last_page) return;

    updateSearchParams({ page: page.toString() }, false);
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const rangeStart = Math.max(1, current_page - 2);
    const rangeEnd = Math.min(last_page, current_page + 2);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageButtons.push(
        <Button
          disabled={isPlaceholderData}
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-1 ${
            i === current_page
              ? "bg-primary-500 text-white"
              : "bg-secondary-200 dark:bg-secondary-500 dark:hover:bg-primary-400"
          }`}
        >
          {i}
        </Button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="flex justify-between mt-4">
      <Button
        disabled={!has_prev_page || isPlaceholderData}
        onClick={() => handlePageClick(current_page - 1)}
      >
        Previous
      </Button>
      {has_pages && <div className="flex space-x-2">{renderPageNumbers()}</div>}
      <Button
        disabled={!has_next_page || isPlaceholderData}
        onClick={() => handlePageClick(current_page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
