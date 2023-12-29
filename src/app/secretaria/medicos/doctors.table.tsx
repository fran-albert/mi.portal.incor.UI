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
import Paginacion from "@/components/Pagination";
import LoadingPage from "@/components/Loading";
import { createTableColumns, formatearDNI, stateName } from "@/common/Utils";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditDoctorModal from "./edit.doctor";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Filter from "@/components/Filter";
import DeleteDoctorModal from "./eliminar.medico.";
import NewDoctorModal from "./new.doctor";
import useFetchDoctors from "@/hooks/useFetchDoctors";
import useFetchStates from "@/hooks/useFetchState";
import { IUser } from "@/common/interfaces/user.interface";
import { ITableColumn } from "@/common/interfaces/table.column.interface";

const DoctorsTable = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<IUser | null>(null);
  const [filtro, setFiltro] = useState<string>("");
  const itemsPorPagina = 8;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [shownDoctors, setShownDoctors] = useState<IUser[]>([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [showMessageNotFound, setShowMessageNotFound] =
    useState<boolean>(false);
  const { session } = useCustomSession();
  const {
    doctors,
    totalDoctors,
    isLoading: isLoadingDoctors,
    addDoctorToList,
    removeDoctorFromList,
  } = useFetchDoctors(session?.user?.token);
  const totalPages = Math.ceil(totalDoctors / itemsPorPagina);
  const { states, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalOpenDelete = (doctor: IUser) => {
    setSelectedDoctor(doctor);
    setIsModalOpenDelete(true);
  };

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleModalOpenEdit = (doctor: IUser) => {
    setSelectedDoctor(doctor);
    setIsModalOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsModalOpenEdit(false);
  };

  useEffect(() => {
    const indiceDelUltimodoctor = paginaActual * itemsPorPagina;
    const indiceDelPrimerdoctor = indiceDelUltimodoctor - itemsPorPagina;

    const filteredDoctors = doctors.filter((doctor) => {
      return (
        doctor.name?.toLowerCase().includes(filtro.toLowerCase()) ||
        doctor.lastname?.toLowerCase().includes(filtro.toLowerCase()) ||
        String(doctor.dni).includes(filtro) ||
        doctor.email?.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setShownDoctors(
      filteredDoctors.slice(indiceDelPrimerdoctor, indiceDelUltimodoctor)
    );

    setShowMessageNotFound(filteredDoctors.length === 0);
  }, [filtro, paginaActual, doctors]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  const configDoctors: ITableColumn[] = [
    { key: "#", label: "#" },
    { key: "medico", label: "MEDICO" },
    { key: "dni", label: "D.N.I" },
    { key: "telefono", label: "TELEFONO" },
    { key: "domicilio", label: "DOMICILIO" },
    { key: "", label: "" },
  ];

  const columns = createTableColumns(configDoctors);

  if (isLoadingDoctors || isLoadingStates) {
    return <LoadingPage props={"Cargando médicos..."} />;
  }

  return (
    <div className="p-4 mt-40">
      <div className="flex flex-col sm:flex-row items-center pb-4">
        <div className="flex-grow pr-1">
          <Filter
            placeholder="Buscar médicos..."
            onFilterChange={handleFiltroChange}
          />
        </div>

        <Button onPress={handleModalOpen} className="bg-teal-500 m-1">
          Nuevo Médico
        </Button>
      </div>
      {showMessageNotFound && (
        <div className="text-center py-4">
          <span className="text-gray-600">
            No se encontraron médicos con ese criterio de búsqueda.
          </span>
        </div>
      )}
      {!showMessageNotFound && (
        <Table
          aria-label="Médicos"
          bottomContent={
            <div className="flex w-full justify-center">
              <Paginacion
                totalItems={totalDoctors}
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
            {shownDoctors.map((doctor, index) => (
              <TableRow
                key={doctor.id}
                className="transition-all hover:bg-gray-100"
              >
                <TableCell className="py-3 text-gray-900 text-base">
                  {(paginaActual - 1) * itemsPorPagina + (index + 1)}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 py-3 text-base">
                  <User
                    name={`${doctor.lastname}, ${doctor.name}`}
                    description={doctor.email}
                    avatarProps={{
                      src: doctor.photo
                        ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${doctor.photo}`
                        : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png",
                    }}
                  />
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  {formatearDNI(doctor.dni)}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  {doctor.phone}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base w-60">
                  {stateName(states, doctor.city.idState)},{" "}
                  {doctor.city.city}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  <div className="relative flex justify-around items-center gap-1">
                    <Tooltip content="Editar médico">
                      <span className="text-3xl text-default-400 cursor-pointer active:opacity-50">
                        <FaUserEdit
                          onClick={() => handleModalOpenEdit(doctor)}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Eliminar médico">
                      <span className="text-3xl text-danger cursor-pointer active:opacity-50">
                        <MdDelete
                          onClick={() => handleModalOpenDelete(doctor)}
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
      <DeleteDoctorModal
        isOpen={isModalOpenDelete}
        onOpenChange={closeModalDelete}
        doctor={selectedDoctor}
        onDoctorRemoved={removeDoctorFromList}
      />
      <NewDoctorModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        onAddDoctor={addDoctorToList}
      />
      <EditDoctorModal
        isOpen={isModalOpenEdit}
        onOpenChange={closeModalEdit}
        doctor={selectedDoctor}
        provincias={states}
      />
    </div>
  );
};

export default DoctorsTable;
