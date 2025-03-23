import { ComponentProps } from "react";

export default function TextInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="text"
      {...props}
      className={`p-2 border-2 border-secondary-200 rounded-md outline-none hover:border-secondary-300 focus:border-secondary-300 transition-colors duration-200
        ${className}`}
    />
  );
}
