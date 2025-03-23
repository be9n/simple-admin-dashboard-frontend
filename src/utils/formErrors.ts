import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function setValidationErrors<T extends FieldValues>(
  errors: Record<string, string[]>,
  setError: UseFormSetError<T>
) {
  Object.entries(errors).forEach(([key, value]) => {
    setError(key as Path<T>, { message: value[0] });
  });
}
