// Custom components
import React from "react";
import { Field } from "@surinderlohat/react-form-validation";

function TextareaField(props: {
  field: Field;
  id: string;
  extra: string;
  variant: string;
  showLabel?: boolean;
  state?: string;
  disabled?: boolean;
  onChange: any;
}) {
  const { field, id, showLabel, extra, variant, state, disabled } = props;

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        } ${showLabel ? "none" : "hidden"}`}
      >
        {field.label}
      </label>
      <textarea
        rows="10"
        {...field.bind()}
        id={id}
        className={`mt-2 flex w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : field.hasError
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : !field.hasError
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
      ></textarea>
    </div>
  );
}

export default TextareaField;
