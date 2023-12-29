"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Button,
  Tooltip,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { createTableColumns } from "@/common/Utils";
import { useRouter } from "next/navigation";
import Paginacion from "@/components/Pagination";
import LoadingPage from "@/components/Loading";
import { formatearDNI } from "@/common/Utils";
import { FaFileMedicalAlt } from "react-icons/fa";
import { PiSyringeDuotone, PiEye, PiHeartbeatDuotone } from "react-icons/pi";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Filter from "@/components/Filter";
import useFetchStates from "@/hooks/useFetchState";
import useFetchPacientes from "@/hooks/useFetchPatients";
import { IUser } from "@/common/interfaces/user.interface";
import { ITableColumn } from "@/common/interfaces/table.column.interface";
import useFilterAndPaginate from "@/hooks/useFilterAndPaginate";

const PatientsTable = () => {
  const [filtro, setFiltro] = useState<string>("");
  const itemsPorPagina = 8;
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const nextRouter = useRouter();
  const { session } = useCustomSession();
  const { states, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );
  const {
    pacientes,
    totalPatients,
    isLoading: isLoadingPacientes,
  } = useFetchPacientes(session?.user?.token);
  const totalPages = Math.ceil(totalPatients / itemsPorPagina);
  const [filtradosYMostrados, showMessageNotFound] = useFilterAndPaginate(
    pacientes,
    filtro,
    paginaActual,
    itemsPorPagina
  );

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const handlePatientClick = (paciente: IUser, path: string) => {
    nextRouter.push(`./lista-pacientes/${path}/${paciente.id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  const configPacientes: ITableColumn[] = [
    { key: "#", label: "#" },
    { key: "paciente", label: "PACIENTE" },
    { key: "dni", label: "D.N.I" },
    { key: "telefono", label: "TELEFONO" },
    { key: "healthInsurance", label: "OBRA SOCIAL" },
    { key: "", label: "" },
  ];

  const columns = createTableColumns(configPacientes);

  if (isLoadingPacientes || isLoadingStates) {
    return <LoadingPage props={"Cargando pacientes..."} />;
  }

  return (
    <div className="p-4 mt-40">
      <div className="flex flex-col sm:flex-row items-center pb-4">
        <div className="flex-grow pr-1">
          <Filter
            placeholder="Buscar pacientes..."
            onFilterChange={handleFiltroChange}
          />
        </div>
      </div>
      {showMessageNotFound && (
        <div className="text-center py-4">
          <span className="text-gray-600">
            No se encontraron pacientes con ese criterio de búsqueda.
          </span>
        </div>
      )}
      {!showMessageNotFound && (
        <Table
          aria-label="Pacientes"
          bottomContent={
            <div className="flex w-full justify-center">
              <Paginacion
                totalItems={totalPatients}
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
            {filtradosYMostrados.map((paciente, index) => (
              <TableRow
                key={paciente.id}
                className="transition-all hover:bg-gray-100"
              >
                <TableCell className="py-3 text-gray-900 text-base">
                  {(paginaActual - 1) * itemsPorPagina + (index + 1)}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 py-3 text-base">
                  <User
                    name={`${paciente.lastname}, ${paciente.name}`}
                    description={paciente.email}
                    avatarProps={{
                      src: paciente.photo
                        ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${paciente.photo}`
                        : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png",
                    }}
                  />
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  {formatearDNI(paciente.dni)}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  {paciente.phone}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  {paciente.healthInsurance}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  <div className="relative flex justify-around items-center gap-1">
                    <Tooltip content="Detalles">
                      <span className="text-3xl text-default-400 cursor-pointer active:opacity-50">
                        <PiEye
                          onClick={() =>
                            handlePatientClick(paciente, "dashboard")
                          }
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Antecedentes">
                      <span className="text-3xl text-sky-400 cursor-pointer active:opacity-50">
                        <FaFileMedicalAlt
                          onClick={() =>
                            handlePatientClick(paciente, "antencedentes")
                          }
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Laboratorios">
                      <span className="text-3xl text-teal-500 cursor-pointer active:opacity-50">
                        <PiSyringeDuotone
                          onClick={() =>
                            handlePatientClick(paciente, "laboratorios")
                          }
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Estudios">
                      <span className="text-3xl text-red-600 cursor-pointer active:opacity-50">
                        <PiHeartbeatDuotone
                          onClick={() =>
                            handlePatientClick(paciente, "estudios")
                          }
                        />
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PatientsTable;
