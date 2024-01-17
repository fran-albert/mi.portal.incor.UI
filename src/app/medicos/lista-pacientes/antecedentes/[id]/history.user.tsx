"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
} from "@nextui-org/react";
import { createTableColumns } from "@/common/Utils";
import LoadingPage from "@/components/Loading";
import { ITableColumn } from "@/common/interfaces/table.column.interface";
import { useState } from "react";
import { PiEyeLight, PiPencilSimple, PiTrash  } from "react-icons/pi";
export default function HistoryUser({ paciente }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const configHistory: ITableColumn[] = [
    { key: "#", label: "#" },
    { key: "title", label: "TITULO" },
    { key: "date", label: "FECHA" },
    { key: "", label: "" },
  ];

  const columns = createTableColumns(configHistory);

  // if (isLoading) {
  //   return <LoadingPage props={"Cargando antecedentes..."} />;
  // }

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col sm:flex-row items-center pb-4"></div>
        {/* {!showMessageNotFound && ( */}
        <Table
          aria-label="Pacientes"
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
            {/* {filtradosYMostrados.map((paciente, index) => ( */}
            {/* <TableRow
                key={paciente.id}
                className="transition-all hover:bg-gray-100"
              > */}
            <TableRow>
              <TableCell className="py-3 text-gray-900 text-base">
                {/* {(paginaActual - 1) * itemsPorPagina + (index + 1)} */}1
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium text-gray-900 py-3 text-base">
                USER
              </TableCell>
              <TableCell className="py-3 text-gray-900 text-base">2</TableCell>
              <TableCell className="py-3 text-gray-900 text-base">
                <div className="relative flex justify-around items-center gap-1">
                  <Tooltip content="Ver">
                    <span className="text-3xl text-sky-400 cursor-pointer active:opacity-50">
                      <PiEyeLight 
                          // onClick={() =>
                          //   handlePatientClick(paciente, "antecedentes")
                          // }
                        />
                    </span>
                  </Tooltip>
                  <Tooltip content="Editar">
                    <span className="text-3xl text-teal-500 cursor-pointer active:opacity-50">
                      <PiPencilSimple 
                          // onClick={() =>
                          //   handlePatientClick(paciente, "laboratorios")
                          // }
                        />
                    </span>
                  </Tooltip>
                  <Tooltip content="Eliminar">
                    <span className="text-3xl text-red-600 cursor-pointer active:opacity-50">
                      <PiTrash 
                          // onClick={() =>
                          //   handlePatientClick(paciente, "estudios")
                          // }
                        />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
            {/* </TableRow> */}
            {/* ))} */}
          </TableBody>
        </Table>
        {/* )} */}
      </div>
    </>
  );
}
