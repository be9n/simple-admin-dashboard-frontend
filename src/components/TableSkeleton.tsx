import { Skeleton } from "./ui/skeleton";

export default function TableSkeleton() {
  return (
    <table className="w-full min-w-[1000px]">
      <thead>
        <tr className="bg-primary-200/40 dark:bg-secondary-500">
          {[...Array(3)].map((_, i) => (
            <th
              key={i}
              className="text-start font-normal px-3 py-2 first:rounded-s-lg last:rounded-e-lg"
            >
              <Skeleton className="w-25 h-5 rounded-lg bg-secondary-200 dark:bg-secondary-400" />
            </th>
          ))}
          <th className="text-start font-normal px-3 py-2 first:rounded-s-lg last:rounded-e-lg">
            <Skeleton className="w-25 h-5 rounded-lg bg-secondary-200 dark:bg-secondary-400" />
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(10)].map((_, i) => (
          <tr
            key={i}
            className="hover:bg-primary-100 dark:hover:bg-secondary-500/30 transition-colors"
          >
            {[...Array(3)].map((_, i) => (
              <td
                key={i}
                className="px-3 py-2 first:rounded-s-lg last:rounded-e-lg"
              >
                <Skeleton
                  className={`w-${Math.floor(Math.random() * 40)} h-7 rounded-lg`}
                />
              </td>
            ))}
            <td
              key={i}
              className="px-3 py-2 first:rounded-s-lg last:rounded-e-lg flex gap-2"
            >
              <Skeleton className="w-20 h-7 rounded-lg" />
              <Skeleton className="w-15 h-7 rounded-lg" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
