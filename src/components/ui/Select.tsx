import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export function CustomSelect({ options, ...props }: Props) {
  return (
    <div className="relative w-full">
      <select
        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-800 sm:text-sm sm:leading-6 px-3"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
