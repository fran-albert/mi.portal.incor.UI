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
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Filter from "@/components/Filter";
import DeleteDoctorModal from "./eliminar.medico.";
import NewPatientModal from "./nuevo.medico";
import { IUser } from "@/common/interfaces/user.interface";

const MedicosTabla = () => {
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<IUser | null>(null);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [filtro, setFiltro] = useState<string>("");
  const itemsPorPagina = 8;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [shownDoctors, setShownDoctors] = useState<IUser[]>([]);
  const totalPages = Math.ceil(totalDoctors / itemsPorPagina);
  const [showMessageNotFound, setShowMessageNotFound] =
    useState<boolean>(false);
  const { session } = useCustomSession();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/doctors`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setDoctors(res.data);
        setTotalDoctors(res.data.length);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  const adddoctorToList = (newdoctor: IUser) => {
    setDoctors([...doctors, newdoctor]);
  };

  const removedoctorFromList = (iddoctor: number) => {
    setDoctors(doctors.filter((p) => p.id !== iddoctor));
  };

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

  useEffect(() => {
    const indiceDelUltimodoctor = paginaActual * itemsPorPagina;
    const indiceDelPrimerdoctor = indiceDelUltimodoctor - itemsPorPagina;

    const filteredDoctors = doctors.filter((doctors) => {
      return (
        doctors.name?.toLowerCase().includes(filtro.toLowerCase()) ||
        doctors.lastname?.toLowerCase().includes(filtro.toLowerCase()) ||
        String(doctors.dni).includes(filtro) ||
        doctors.email?.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setTotalDoctors(filteredDoctors.length);

    if (filteredDoctors.length === 0) {
      setShowMessageNotFound(true);
    } else {
      setShowMessageNotFound(false);
    }

    setShownDoctors(
      filteredDoctors.slice(indiceDelPrimerdoctor, indiceDelUltimodoctor)
    );
  }, [filtro, paginaActual, doctors]);

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
      key: "medico",
      label: "MEDICO",
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
            {(column) => (
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
                        ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${doctor.photo}.jpeg`
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
                <TableCell>{doctor.city.city}</TableCell>
                <TableCell className="py-3 text-gray-900 text-base">
                  <div className="relative flex justify-around items-center gap-1">
                    <Tooltip content="Editar médico">
                      <span className="text-3xl text-default-400 cursor-pointer active:opacity-50">
                        <FaUserEdit />
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
        onDoctorRemoved={removedoctorFromList}
      />
      <NewPatientModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        onAddDoctor={adddoctorToList}
      />
    </div>
  );
};

export default MedicosTabla;
