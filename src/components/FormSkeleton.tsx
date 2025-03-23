import { Skeleton } from "./ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left column (General Information) */}
      <div className="bg-white dark:bg-secondary-600 lg:col-span-2 p-3 rounded-xl drop-shadow-sm space-y-3">
        <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-300 mb-3">
          General Information
        </h2>
        
        {/* Name and Price fields */}
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-2">
            <Skeleton className="w-16 h-4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-xl" /> {/* Input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="w-16 h-4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-xl" /> {/* Input */}
          </div>
        </div>
        
        {/* Category dropdown */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 mb-1" /> {/* Label */}
          <Skeleton className="h-10 w-48 rounded-xl" /> {/* Select */}
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <Skeleton className="h-9 w-20 rounded-xl" /> {/* Submit button */}
          <Skeleton className="h-9 w-20 rounded-xl" /> {/* Cancel button */}
        </div>
      </div>
      
      {/* Right column (Product Image) */}
      <div className="bg-white dark:bg-secondary-600 lg:col-span-1 p-3 rounded-xl drop-shadow-sm">
        <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-300 mb-3">
          Product Image
        </h2>
        <div className="space-y-2">
          <Skeleton className="w-28 h-4 mb-1" /> {/* Label */}
          <Skeleton className="h-40 w-full rounded-xl" /> {/* Drop zone */}
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-24 rounded-xl" /> {/* Upload button */}
            <Skeleton className="h-6 w-24 rounded-xl" /> {/* Cancel button */}
          </div>
        </div>
      </div>
    </div>
  );
}