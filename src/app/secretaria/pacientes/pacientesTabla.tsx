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
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Paginacion from "@/components/Pagination";
import LoadingPage from "@/components/Loading";
import { formatearDNI } from "@/common/Utils";
import { AiFillFileAdd } from "react-icons/ai";
import { useCustomSession } from "@/context/SessionAuthProviders";
// import FiltroInput from "@/components/FiltroComponent";
// import AgregarPacienteModal from "./agregarPaciente";
// import AgregarLaboratorioModal from "./agregarLaboratorio";

interface Paciente {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phone: string;
  id: number;
  city: {
    city: string;
  };
  photo: string;
}

export default function PacientesTabla() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [error, setError] = useState(null);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [filtro, setFiltro] = useState("");
  const itemsPorPagina = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pacientesMostrados, setPacientesMostrados] = useState<Paciente[]>([]);
  const [isModalOpenLabs, setIsModalOpenLabs] = useState(false);
  const totalPages = Math.ceil(totalPatients / itemsPorPagina);
  const [provincias, setProvincias] = useState([]);
  const { session } = useCustomSession();

  useEffect(() => {
    setIsLoading(true);

    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/patients`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        console.log(res.data);
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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalOpenLabs = (paciente: any) => {
    setSelectedPaciente(paciente);
    setIsModalOpenLabs(true);
  };

  const closeModalLabs = () => {
    setIsModalOpenLabs(false);
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
        {/* <div className="flex-grow pr-1">
          <FiltroInput
            placeholder="Buscar pacientes..."
            onFilterChange={handleFiltroChange}
          />
        </div> */}
        <Button onPress={handleModalOpen} className="bg-teal-500">
          Nuevo Paciente
        </Button>
      </div>

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
                      ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${paciente.photo}.jpeg`
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
              <TableCell>
                <Button isIconOnly aria-label="Like" variant="bordered">
                  <AiFillFileAdd
                    className="cursor-pointer"
                    color="#0d9488"
                    title="Agregar laboratorio"
                    onClick={() => handleModalOpenLabs(paciente)}
                    size={30}
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <AgregarLaboratorioModal
        isOpen={isModalOpenLabs}
        onOpenChange={closeModalLabs}
        paciente={selectedPaciente}
        onLaboratorioAdded={onLaboratorioAddedDummy}
      />
      <AgregarPacienteModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        onAddPaciente={addPacienteToList}
      /> */}
    </div>
  );
}
