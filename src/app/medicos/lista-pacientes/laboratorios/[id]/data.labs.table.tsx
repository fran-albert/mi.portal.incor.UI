"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { createTableColumns, formatDate } from "@/common/Utils";
import { ITableColumn } from "@/common/interfaces/table.column.interface";
import { Estudio } from "@/common/interfaces/study.interface";

interface DatosEditables {
  [date: string]: {
    [prueba: string]: string;
  };
}

interface Lab {
  id: number;
  name: string;
  date: string;
  file: string;
  deletedAt: string | null;
  datalab: Datalab;
}

interface Datalab {
  id: number;

  ldh: string;
  lonogramaSangre: string;
  colesterolHdl: string;
  colesterolLdl: string;
  trigliceridos: string;
  uricemia: string;
  bilirrubina: string;
  colinesterasaSerica: string;
  gammaGlutamil: string;
  t4Libre: string;
  otros: string;
}

const DataLabsTable = ({ paciente }: any) => {
  const labs = paciente?.labs || [];
  const [uniqueDates, setUniqueDates] = useState<any[]>([]);
  const [datosEditables, setDatosEditables] = useState<DatosEditables>({});
  const [labDataByDate, setLabDataByDate] = useState<Map<string, any[]>>(
    new Map()
  );

  useEffect(() => {
    const dates = new Set(labs.map((lab: any) => lab.date.split("T")[0]));
    setUniqueDates(Array.from(dates));
  }, [labs]);

  useEffect(() => {
    const newLabDataByDate = new Map();
    labs.forEach((lab: any) => {
      const date = lab.date.split("T")[0];
      if (!newLabDataByDate.has(date)) {
        newLabDataByDate.set(date, []);
      }
      if (lab.datalab) {
        newLabDataByDate.get(date).push(lab.datalab);
      }
    });
    setLabDataByDate(newLabDataByDate);
    setUniqueDates(Array.from(newLabDataByDate.keys()));
  }, [labs]);

  const tiposDePruebas = [
    "ldh",
    "lonogramaSangre",
    "colesterolHdl",
    "colesterolLdl",
    "trigliceridos",
    "uricemia",
    "bilirrubina",
    "colinesterasaSerica",
    "gammaGlutamil",
    "t4Libre",
    "otros",
  ];
  const columns = [
    { key: "datos", label: "Datos" },
    ...uniqueDates.map((date) => ({ key: date, label: date })),
  ];

  useEffect(() => {
    const initialData: DatosEditables = {};
    labs.forEach((lab: Lab) => {
      const date = lab.date.split("T")[0];

      if (lab.datalab) {
        tiposDePruebas.forEach((prueba) => {
          if (!initialData[date]) {
            initialData[date] = {};
          }
          const valor = lab.datalab[prueba as keyof Datalab];
          initialData[date][prueba] = valor != null ? valor.toString() : "";
        });
      }
    });
    setDatosEditables(initialData);
  }, [labs]);

  const handleDataChange = (date: string, prueba: string, newValue: string) => {
    const updatedData = { ...datosEditables };

    if (!updatedData[date]) {
      updatedData[date] = {};
    }

    updatedData[date][prueba] = newValue;
    setDatosEditables(updatedData);
  };

  const renderEditableCell = (date: string, prueba: string) => {
    const value =
      datosEditables[date] && datosEditables[date][prueba]
        ? datosEditables[date][prueba]
        : "";
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleDataChange(date, prueba, e.target.value)}
        className="p-1 border rounded w-full"
        style={{ maxWidth: "100px" }}
      />
    );
  };

  return (
    <>
      <div className="flex justify-center p-4">
        <div className="w-1/2">
          {labs.length > 0 && uniqueDates.length > 0 ? (
            <Table
              aria-label="Descripción de la tabla"
              classNames={{ wrapper: "min-h-[222px]" }}
            >
              <TableHeader>
                {columns.map((column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {tiposDePruebas.map((prueba) => (
                  <TableRow key={prueba}>
                    <TableCell>{prueba}</TableCell>
                    {uniqueDates.map((date) => (
                      <TableCell key={`${date}-${prueba}`}>
                        {renderEditableCell(date, prueba)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 text-lg"></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DataLabsTable;
