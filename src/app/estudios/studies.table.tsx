"use client";
import { useEffect, useState } from "react";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { FaFilePdf } from "react-icons/fa";
import { createTableColumns, formatDate } from "@/common/Utils";
import LoadingPage from "@/components/Loading";
import Paginacion from "@/components/Pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import useFetchProfile from "@/hooks/useFetchProfile";
import { Estudio } from "@/common/interfaces/study.interface";
import { ITableColumn } from "@/common/interfaces/table.column.interface";

export default function StudiesTable() {
  const itemsPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);
  const [estudiosMostrados, setEstudiosMostrados] = useState<Estudio[]>([]);
  const { session } = useCustomSession();
  const { profile, isLoading: isProfileLoading } = useFetchProfile(
    session?.user?.token
  );
  const estudios = profile?.labs || [];
  const totalEstudios = estudios.length;
  const totalPages = Math.ceil(totalEstudios / itemsPorPagina);

  useEffect(() => {
    const indiceDelUltimoEstudio = paginaActual * itemsPorPagina;
    const indiceDelPrimerEstudio = indiceDelUltimoEstudio - itemsPorPagina;

    setEstudiosMostrados(
      estudios.slice(indiceDelPrimerEstudio, indiceDelUltimoEstudio)
    );
  }, [paginaActual, estudios]);

  const configStudies: ITableColumn[] = [
    { key: "#", label: "#" },
    { key: "evento", label: "EVENTO" },
    { key: "fecha", label: "FECHA" },
    { key: "", label: "" },
  ];

  const columns = createTableColumns(configStudies);

  if (isProfileLoading) {
    return <LoadingPage props="Cargando tus estudios..." />;
  }

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  return (
    <div className="flex justify-center p-4 mt-40">
      <div className="w-1/2">
        <h2 className="text-3xl font-bold text-center mb-4">Tus Estudios</h2>
        {estudios && estudios.length > 0 ? (
          <>
            <Table
              aria-label="Descripción de la tabla"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Paginacion
                    totalItems={totalEstudios}
                    itemsPerPage={itemsPorPagina}
                    currentPage={paginaActual}
                    total={totalPages}
                    setCurrentPage={setPaginaActual}
                    onChange={handlePageChange}
                  />
                </div>
              }
              classNames={{
                wrapper: "min-h-[222px]",
              }}
            >
              <TableHeader columns={columns}>
                {(column: ITableColumn) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody>
                {estudiosMostrados &&
                  estudiosMostrados.map((estudio, index) => (
                    <TableRow
                      key={estudio.id}
                      className="transition-all hover:bg-gray-100 dark:border-black-700 dark:bg-black-800"
                    >
                      <TableCell className="py-3 text-gray-900 text-base">
                        {(paginaActual - 1) * itemsPorPagina + (index + 1)}
                      </TableCell>
                      <TableCell className="py-3 text-gray-900 text-base font-medium">
                        {estudio.name}
                      </TableCell>
                      <TableCell className="py-3 text-gray-900 text-base">
                        {formatDate(estudio.date)}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="relative flex justify-around items-center gap-1">
                          <Tooltip content="Ver PDF">
                            <span className="text-3xl cursor-pointer active:opacity-50">
                              <a
                                href={`https://incor-ranking.s3.us-east-1.amazonaws.com/storage/laboratorios/${estudio.archivo}.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaFilePdf size={30} color="#0d9488" />
                              </a>
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 text-lg">
              No tienes estudios registrados en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
