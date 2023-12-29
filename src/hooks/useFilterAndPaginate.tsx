import { IUser } from "@/common/interfaces/user.interface";
import { useState, useEffect } from "react";

const useFilterAndPaginate = <T extends IUser>(
  items: T[],
  filtro: string,
  paginaActual: number,
  itemsPorPagina: number
): [T[], boolean] => {
  const [filtradosYMostrados, setFiltradosYMostrados] = useState<T[]>([]);
  const [showMessageNotFound, setShowMessageNotFound] = useState(false);

  useEffect(() => {
    const filtrados = items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(filtro.toLowerCase()) ||
        item.lastname?.toLowerCase().includes(filtro.toLowerCase()) ||
        String(item.dni).includes(filtro) ||
        item.email?.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setShowMessageNotFound(filtrados.length === 0);

    const indiceDelUltimo = paginaActual * itemsPorPagina;
    const indiceDelPrimero = indiceDelUltimo - itemsPorPagina;
    setFiltradosYMostrados(filtrados.slice(indiceDelPrimero, indiceDelUltimo));
  }, [items, filtro, paginaActual, itemsPorPagina]);

  return [filtradosYMostrados, showMessageNotFound];
};

export default useFilterAndPaginate;
