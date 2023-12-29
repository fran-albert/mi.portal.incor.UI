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
import React, { useState } from "react";
import Paginacion from "@/components/Pagination";
import LoadingPage from "@/components/Loading";
import { createTableColumns, formatearDNI, stateName } from "@/common/Utils";
import { AiFillFileAdd } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Filter from "@/components/Filter";
import DeletePatientModal from "./deletePatient";
import NewPatientModal from "./newPatient";
import useFetchStates from "@/hooks/useFetchState";
import useFetchPacientes from "@/hooks/useFetchPatients";
import EditPatientModal from "./edit.patient";
import AddModalLabs from "./addLabs";
import { IUser } from "@/common/interfaces/user.interface";
import useFilterAndPaginate from "@/hooks/useFilterAndPaginate";
import useModal from "@/hooks/useModal";
import { ITableColumn } from "@/common/interfaces/table.column.interface";

const PatientsTable = () => {
  const [selectedPaciente, setSelectedPaciente] = useState<IUser | null>(null);
  const [filtro, setFiltro] = useState<string>("");
  const itemsPorPagina = 8;
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [isModalOpenLabs, setIsModalOpenLabs] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const { session } = useCustomSession();
  const { states, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );
  const {
    pacientes,
    totalPatients,
    isLoading: isLoadingPacientes,
    addPatientToList,
    removePatientFromList,
  } = useFetchPacientes(session?.user?.token);
  const [filtradosYMostrados, showMessageNotFound] = useFilterAndPaginate(
    pacientes,
    filtro,
    paginaActual,
    itemsPorPagina
  );
  const totalPages = Math.ceil(totalPatients / itemsPorPagina);
  const onLaboratorioAddedDummy = (data: any) => {};

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  // const updatePacienteToList = (pacienteUpdated: any) => {
  //   console.log("Actualizando paciente en la lista:", pacienteUpdated);
  //   setPacientes(
  //     pacientes.map((paciente) =>
  //       paciente.id === pacienteUpdated.id ? pacienteUpdated : paciente
  //     )
  //   );
  // };

  // useEffect(() => {
  //   console.log("Lista de pacientes actualizada:", pacientes);
  // }, [pacientes]);

  const handleModalOpenDelete = (paciente: IUser) => {
    setSelectedPaciente(paciente);
    setIsModalOpenDelete(true);
  };

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleModalOpenLabs = (paciente: IUser) => {
    setSelectedPaciente(paciente);
    setIsModalOpenLabs(true);
  };

  const closeModalLabs = () => {
    setIsModalOpenLabs(false);
  };

  const handleModalOpenEdit = (paciente: IUser) => {
    setSelectedPaciente(paciente);
    setIsModalOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsModalOpenEdit(false);
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
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
    { key: "domicilio", label: "DOMICILIO" },
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
        <Button onPress={() => openModal()} className="bg-teal-500 m-1">
          Nuevo Paciente
        </Button>
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
                <TableCell className="py-3 text-gray-900 text-base w-60">
                  {stateName(states, paciente.city.idState)},{" "}
                  {paciente.city.city}
                </TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  <div className="relative flex justify-around items-center gap-1">
                    <Tooltip content="Agregar laboratorio">
                      <span className="text-3xl text-default-400 cursor-pointer active:opacity-50">
                        <AiFillFileAdd
                          color="#0d9488"
                          onClick={() => handleModalOpenLabs(paciente)}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Editar paciente">
                      <span className="text-3xl text-default-400 cursor-pointer active:opacity-50">
                        <FaUserEdit
                          onClick={() => handleModalOpenEdit(paciente)}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Eliminar paciente">
                      <span className="text-3xl text-danger cursor-pointer active:opacity-50">
                        <MdDelete
                          onClick={() => handleModalOpenDelete(paciente)}
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
      <AddModalLabs
        isOpen={isModalOpenLabs}
        onOpenChange={closeModalLabs}
        paciente={selectedPaciente}
        onLaboratorioAdded={onLaboratorioAddedDummy}
      />
      <DeletePatientModal
        isOpen={isModalOpenDelete}
        onOpenChange={closeModalDelete}
        paciente={selectedPaciente}
        onPacienteRemoved={removePatientFromList}
      />
      <NewPatientModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        onAddPaciente={addPatientToList}
        provincias={states}
      />
      <EditPatientModal
        isOpen={isModalOpenEdit}
        onOpenChange={closeModalEdit}
        paciente={selectedPaciente}
        provincias={states}
        // onPacienteUpdated={updatePacienteToList}
      />
    </div>
  );
};

export default PatientsTable;
