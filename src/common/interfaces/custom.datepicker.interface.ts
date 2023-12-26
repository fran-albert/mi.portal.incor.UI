export interface ExampleCustomInputProps {
  value?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface MyDatePickerProps {
  onChange: (date: Date | null) => void;
  selectedDate: Date | null;
}
