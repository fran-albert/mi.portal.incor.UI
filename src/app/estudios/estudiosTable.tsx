"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaFilePdf } from "react-icons/fa";
import { formatDate } from "@/common/Utils";
import LoadingPage from "@/components/Loading";
import Paginacion from "@/components/Pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Button,
  TableRow,
  TableCell,
} from "@nextui-org/react";

interface Estudio {
  id: string;
  name: string;
  date: string;
  archivo: string;
}

export default function EstudiosTable() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [totalEstudios, setTotalEstudios] = useState(0);
  const itemsPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);
  const [estudiosMostrados, setEstudiosMostrados] = useState<Estudio[]>([]);
  const totalPages = Math.ceil(totalEstudios / itemsPorPagina);
  const idUser = session?.user && 'id' in session.user ? session.user.id : null;

  useEffect(() => {
    setIsLoading(true);

    async function fetchData() {
      if (idUser) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${idUser}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );
          setEstudios(res.data.labs);
          setTotalEstudios(res.data.labs.length);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    }

    fetchData();
  }, [idUser, session?.user?.token]);

  useEffect(() => {
    const indiceDelUltimoEstudio = paginaActual * itemsPorPagina;
    const indiceDelPrimerEstudio = indiceDelUltimoEstudio - itemsPorPagina;

    setEstudiosMostrados(
      estudios.slice(indiceDelPrimerEstudio, indiceDelUltimoEstudio)
    );
  }, [paginaActual, estudios]);

  const columns = [
    {
      key: "#",
      label: "#",
    },
    {
      key: "evento",
      label: "EVENTO",
    },
    {
      key: "fecha",
      label: "FECHA",
    },
    {
      key: "",
      label: "",
    },
  ];

  if (isLoading) {
    return <LoadingPage props="Cargando tus estudios..." />;
  }

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage);
  };

  return (
    <div className="p-4 mt-40">
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
              {(column) => (
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
                    <TableCell>
                      <Button isIconOnly aria-label="Like" variant="bordered">
                        <a
                          href={`https://incor-ranking.s3.us-east-1.amazonaws.com/storage/laboratorios/${estudio.archivo}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFilePdf size={25} color="#0d9488" />
                        </a>
                      </Button>
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
  );
}
