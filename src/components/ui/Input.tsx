import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function CustomInput({ type, icon, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Icon = showPassword ? FaEyeSlash : FaEye;

  return (
    <div className="relative w-full">
      <input
        type={type === "password" && !showPassword ? "password" : "text"}
        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-800 sm:text-sm sm:leading-6 px-3"
        {...props}
      />
      {type === "password" && (
        <Icon
          size={35}
          color="#0d9488"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        />
      )}
    </div>
  );
}
