interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function CustomLabel({ children, ...props }: Props) {
  return (
    <label className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
}
