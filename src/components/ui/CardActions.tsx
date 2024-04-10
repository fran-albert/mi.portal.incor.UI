import { CardFooter } from "@nextui-org/react";
import ActionIcon from "./ActionIcon";
import { PiPencilSimple, PiTrash } from "react-icons/pi";

const CardActions = ({ item }: any) => {
  return (
    <CardFooter>
      <div className="flex justify-around">
        <ActionIcon icon={<PiPencilSimple />} tooltip="Editar" />
        <ActionIcon icon={<PiTrash />} tooltip="Eliminar" />
      </div>
    </CardFooter>
  );
};

export default CardActions;
