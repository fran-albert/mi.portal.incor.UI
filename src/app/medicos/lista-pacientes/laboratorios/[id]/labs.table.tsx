"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Paginacion from "@/components/Pagination";
import { createTableColumns, formatDate } from "@/common/Utils";
import { FaFilePdf } from "react-icons/fa";
import { ITableColumn } from "@/common/interfaces/table.column.interface";
import { Estudio } from "@/common/interfaces/study.interface";
import HeaderPatient from "@/components/ui/Header";
import LoadingPage from "@/components/Loading";

const LabsTable = ({ paciente }: any) => {
  const itemsPorPagina = 4;
  const [paginaActual, setPaginaActual] = useState(1);
  const [estudiosMostrados, setEstudiosMostrados] = useState<Estudio[]>([]);
  const labs = paciente?.labs || [];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const totalLabs = labs.length;
  const totalPages = Math.ceil(totalLabs / itemsPorPagina);

  useEffect(() => {
    setIsLoading(true);
    const indiceDelUltimoEstudio = paginaActual * itemsPorPagina;
    const indiceDelPrimerEstudio = indiceDelUltimoEstudio - itemsPorPagina;

    setEstudiosMostrados(
      labs.slice(indiceDelPrimerEstudio, indiceDelUltimoEstudio)
    );
    setIsLoading(false);
  }, [paginaActual, labs]);

  const configStudies: ITableColumn[] = [
    { key: "#", label: "#" },
    { key: "evento", label: "EVENTO" },
    { key: "fecha", label: "FECHA" },
    { key: "", label: "" },
  ];

  const columns = createTableColumns(configStudies);

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  if (isLoading) {
    return <LoadingPage props={"Cargando datos del paciente..."} />;
  }

  return (
    <>
      <HeaderPatient user={paciente} />
      <div className="flex justify-center p-4">
        <div className="w-1/2">
          {labs && labs.length > 0 ? (
            <>
              <Table
                aria-label="Descripción de la tabla"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Paginacion
                      totalItems={totalLabs}
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
                                  href={`https://incor-ranking.s3.us-east-1.amazonaws.com/storage/laboratorios/${estudio.file}.pdf`}
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
                No tiene laboratorios registrados en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LabsTable;
