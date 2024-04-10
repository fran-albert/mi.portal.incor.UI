import { Tooltip } from "@nextui-org/react";

interface ActionIconProps {
  icon: any;
  tooltip: string;
  color?: string;
  onClick?: () => void;
  tooltipColor?: any;
}

const ActionIcon = ({
  icon,
  tooltip,
  color,
  onClick,
  tooltipColor,
}: ActionIconProps) => {
  return (
    <Tooltip content={tooltip} color={tooltipColor}>
      <span
        className={`text-3xl cursor-pointer active:opacity-50 ${color}`}
        onClick={onClick}
      >
        {icon}
      </span>
    </Tooltip>
  );
};

export default ActionIcon;
