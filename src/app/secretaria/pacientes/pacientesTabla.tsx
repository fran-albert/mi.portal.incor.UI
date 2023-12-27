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
import axios from "axios";
import Paginacion from "@/components/Pagination";
import LoadingPage from "@/components/Loading";
import { formatearDNI } from "@/common/Utils";
import { AiFillFileAdd, AiFillDelete } from "react-icons/ai";
import { FaUserEdit, FaFilePdf } from "react-icons/fa";
import { MdAddCircle, MdCreate, MdDelete } from "react-icons/md";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Filter from "@/components/Filter";
import DeletePatientModal from "./deletePatient";
import NewPatientModal from "./newPatient";
import EditPatientModal from "./editPatient";
import AddModalLabs from "./addLabs";
import { IUser } from "@/common/interfaces/user.interface";

const PacientesTabla = () => {
  const [pacientes, setPacientes] = useState<IUser[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<IUser | null>(null);
  const [state, setState] = useState<any>({});
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [filtro, setFiltro] = useState<string>("");
  const itemsPorPagina = 8;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [pacientesMostrados, setPacientesMostrados] = useState<IUser[]>([]);
  const [isModalOpenLabs, setIsModalOpenLabs] = useState<boolean>(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const totalPages = Math.ceil(totalPatients / itemsPorPagina);
  const [showMessageNotFound, setShowMessageNotFound] =
    useState<boolean>(false);
  const { session } = useCustomSession();

  useEffect(() => {
    setIsLoading(true);

    async function fetchData() {
      try {
        const responseState = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/states`
        );
        setState(responseState.data);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/patients`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setPacientes(res.data);
        setTotalPatients(res.data.length);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  const onLaboratorioAddedDummy = (data: any) => {};

  const addPacienteToList = (newPaciente: any) => {
    setPacientes([...pacientes, newPaciente]);
  };

  const removePacienteFromList = (idPaciente: number) => {
    setPacientes(pacientes.filter((p) => p.id !== idPaciente));
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  useEffect(() => {
    const indiceDelUltimoPaciente = paginaActual * itemsPorPagina;
    const indiceDelPrimerPaciente = indiceDelUltimoPaciente - itemsPorPagina;

    const pacientesFiltrados = pacientes.filter((paciente) => {
      return (
        paciente.name?.toLowerCase().includes(filtro.toLowerCase()) ||
        paciente.lastname?.toLowerCase().includes(filtro.toLowerCase()) ||
        String(paciente.dni).includes(filtro) ||
        paciente.email?.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setTotalPatients(pacientesFiltrados.length);

    if (pacientesFiltrados.length === 0) {
      setShowMessageNotFound(true);
    } else {
      setShowMessageNotFound(false);
    }

    setPacientesMostrados(
      pacientesFiltrados.slice(indiceDelPrimerPaciente, indiceDelUltimoPaciente)
    );
  }, [filtro, paginaActual, pacientes]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  const columns = [
    {
      key: "#",
      label: "#",
    },
    {
      key: "paciente",
      label: "PACIENTE",
    },
    {
      key: "dni",
      label: "D.N.I",
    },
    {
      key: "telefono",
      label: "TELEFONO",
    },
    {
      key: "domicilio",
      label: "DOMICILIO",
    },
    {
      key: "",
      label: "",
    },
  ];

  if (isLoading) {
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
        <Button onPress={handleModalOpen} className="bg-teal-500 m-1">
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
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {pacientesMostrados.map((paciente, index) => (
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
                <TableCell>{paciente.city.city}</TableCell>
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
        onPacienteRemoved={removePacienteFromList}
      />
      <NewPatientModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        onAddPaciente={addPacienteToList}
        provincias={state}
      />
      <EditPatientModal
        isOpen={isModalOpenEdit}
        onOpenChange={closeModalEdit}
        paciente={selectedPaciente}
        provincias={state}
      />
    </div>
  );
};

export default PacientesTabla;
