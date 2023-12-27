import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@nextui-org/react";
import {
  ExampleCustomInputProps,
  MyDatePickerProps,
} from "@/common/interfaces/custom.datepicker.interface";


const MyDatePicker = ({ onChange, selectedDate }: MyDatePickerProps) => {
  const ExampleCustomInput = forwardRef<
    HTMLButtonElement,
    ExampleCustomInputProps
  >(({ value, onClick }, ref) => (
    <button
      className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-800 sm:text-sm sm:leading-6 px-3"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      ref={ref}
    >
      {value}
    </button>
  ));
  

  ExampleCustomInput.displayName = "ExampleCustomInput";

  return (
    <div className="flex justify-center">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        locale="es"
        dateFormat="dd/MM/yyyy"
        customInput={<ExampleCustomInput />}
      />
    </div>
  );
};

export default MyDatePicker;
