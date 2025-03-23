import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { createProduct, updateProduct } from "@/api/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { ApiError, Category } from "@/types";
import { setValidationErrors } from "@/utils/formErrors";
import { getCategoriesList } from "@/api/categories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DragAndDropFilePicker from "@/components/DragAndDropFilePicker";
import FormSkeleton from "@/components/FormSkeleton";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type EditProductType = {
  id: number;
  name: string;
  price: number;
  category: Category;
  images: { id: number; url: string }[];
};

const FormSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name must be at least 1 characters" }),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number" })
    .nullable(),
  category_id: z.number().nullable(),
  images: z.array(z.instanceof(File)).nullable(),
});

export type ProductFormData = z.infer<typeof FormSchema>;

export default function CreateProduct({
  editProductData,
  isLoading,
}: {
  editProductData?: EditProductType;
  isLoading?: boolean;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: null,
      category_id: null,
      images: null,
    },
    mode: "onChange",
  });
  const {
    setError,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (editProductData) {
      reset({
        name: editProductData.name ?? "",
        price: editProductData.price ?? null,
        category_id: editProductData.category?.id ?? null,
        images: [],
      });
    }
  }, [editProductData, reset]);
  
  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
  });

  const onSubmit = async (data: ProductFormData) => {
    const mutationPromise = editProductData
      ? updateProductMutation.mutateAsync({ data, id: editProductData.id })
      : createProductMutation.mutateAsync({ data });
    
    toast.promise(mutationPromise, {
      loading: "Creating product...",
      success: (res) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/products/all");

        return {
          message: res.message || "Product created successfully!",
        };
      },
      error: (error: ApiError) => {
        setValidationErrors(error.errors, setError);
        
        return error.message || "An error occurred while creating the product.";
      },
    });

    await mutationPromise;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-500  dark:text-primary-300 mb-4">
        Create Product
      </h1>
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="bg-white dark:bg-secondary-600 lg:col-span-2 p-3 rounded-xl drop-shadow-sm space-y-3">
                <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-300 mb-3">
                  General Information
                </h2>
                <div className="grid lg:grid-cols-2 gap-5 items-start">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-secondary-100">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="dark:placeholder:text-secondary-300 dark:border-secondary-300 dark:text-secondary-100"
                            placeholder="Product Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-secondary-100">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="dark:placeholder:text-secondary-300 dark:border-secondary-300 dark:text-secondary-100"
                            type="number"
                            placeholder="Product Price"
                            value={field.value ?? ""} // Convert null to empty string for display
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? null : Number(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-secondary-100">
                          Category
                        </FormLabel>
                        <CategoriesSelectList
                          onChange={field.onChange}
                          editCategoryId={field.value || undefined}
                        />
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between mt-8">
                  <Button
                    className="text-sm min-w-[75px]"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Spinner className="size-5" /> : "Submit"}
                  </Button>
                  <Button
                    asChild
                    type="button"
                    className="bg-secondary-400 hover:bg-secondary-300 text-sm"
                  >
                    <Link to="/products/all">Cancel</Link>
                  </Button>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-600 lg:col-span-1 p-3 rounded-xl drop-shadow-sm">
                <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-300 mb-3">
                  Product Image
                </h2>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-secondary-100 mb-1">
                        Upload Image
                      </FormLabel>
                      <FormControl>
                        <DragAndDropFilePicker
                          multiple={true}
                          uploadedFiles={editProductData?.images}
                          onChange={(file) => {
                            field.onChange(file); // Update the form field value
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

const CategoriesSelectList = ({
  onChange,
  editCategoryId,
}: {
  onChange: (value: number | null) => void;
  editCategoryId?: number;
}) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories_list"],
    queryFn: getCategoriesList,
    gcTime: 0,
  });

  return (
    <Select
      onValueChange={(value) => {
        if (value) onChange(Number(value));
      }}
      value={editCategoryId?.toString()}
    >
      <FormControl>
        <SelectTrigger className="w-[180px] border-none bg-secondary-100/30 hover:bg-secondary-100/50 dark:bg-secondary-300 cursor-pointer dark:hover:bg-secondary-300/70 transition-colors duration-200">
          {isLoading ? (
            <Skeleton className="w-25 h-4" />
          ) : (
            <SelectValue placeholder="Select a category" />
          )}
        </SelectTrigger>
      </FormControl>
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
};
