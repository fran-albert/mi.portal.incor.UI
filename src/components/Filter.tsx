import React from "react";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

interface FilterProps {
  placeholder: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Filter({ placeholder, onFilterChange }: FilterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          type="text"
          placeholder={placeholder}
          onChange={onFilterChange}
          labelPlacement="outside"
          startContent={<FaSearch />}
        />
      </div>
    </div>
  );
}
