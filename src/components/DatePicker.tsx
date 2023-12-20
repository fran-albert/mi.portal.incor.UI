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
    <Button
      className="w-full p-6 bg-gray-100 border border-gray-100 rounded-xl text-center shadow-lg text-gray-500 font-semibold"
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      ref={ref}
    >
      {value}
    </Button>
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
