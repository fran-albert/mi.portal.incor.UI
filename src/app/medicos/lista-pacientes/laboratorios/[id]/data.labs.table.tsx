"use client";
import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/common/Utils";
import { useTable, ColumnInstance } from "react-table";
import { CustomInput } from "@/components/ui/Input";
import { IUser } from "@/common/interfaces/user.interface";

interface RowData {
  [key: string]: string | number | boolean | undefined;
}

interface Lab {
  id: number;
  name: string;
  date: string;
  file: string;
  deletedAt: string | null;
  datalab: DataLab;
}

interface CustomColumnInstance<D extends object = {}>
  extends ColumnInstance<D> {
  isEditable?: boolean;
}

interface DataLab {
  [key: string]: string | undefined;
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

const testNames: { [key in keyof DataLab]?: string } = {
  ldh: "LDH",
  lonogramaSangre: "Ionograma Sangre",
  colesterolHdl: "Colesterol HDL",
  colesterolLdl: "Colesterol LDL",
  trigliceridos: "Triglicéridos",
  uricemia: "Uricemia",
  bilirrubina: "Bilirrubina",
  colinesterasaSerica: "Colinesterasa Sérica",
  gammaGlutamil: "Gamma Glutamil",
  t4Libre: "T4 Libre",
  otros: "Otros",
};

interface EditableCellProps {
  value: string | number;
  row: {
    index: number;
  };
  column: {
    id: string;
  };
  updateMyData: (index: number, id: string, value: string) => void;
}

const updateMyData = (index: number, id: string, value: string | number) => {
  // lógica de actualización aquí
};

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value.toString());
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <CustomInput value={value} onChange={onChange} onBlur={onBlur} />;
};

const DataLabsTable = ({ paciente }: any) => {
  const labs = useMemo(() => paciente?.labs || [], [paciente]);

  const data = useMemo(() => {
    const rows: { [key: string]: RowData } = {};
    labs.forEach((lab: Lab) => {
      if (lab.datalab) {
        const date = formatDate(lab.date);
        const datalab: DataLab = lab.datalab;
        Object.keys(datalab).forEach((key) => {
          if (key !== "id" && key !== "lab") {
            const testName = testNames[key] || key;
            if (!rows[testName]) {
              rows[testName] = { prueba: testName };
            }
            rows[testName][date] = datalab[key];
          }
        });
      }
    });

    return Object.values(rows);
  }, [labs]);

  const columns = useMemo(() => {
    const dateColumns = labs.map((lab: Lab) => ({
      Header: formatDate(lab.date),
      accessor: formatDate(lab.date),
      Cell: EditableCell,
      isEditable: true,
    }));
    return [
      {
        Header: "Test",
        accessor: "prueba",
      },
      ...dateColumns,
    ];
  }, [labs]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      // updateMyData,
    });

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-300"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => {
            return (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id} 
                      scope="col"
                      className="py-3 px-6 text-sm font-semibold text-gray-900 text-left"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="divide-y divide-gray-200 bg-white"
        >
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="transition-all hover:bg-gray-200"
              >
                {row.cells.map((cell) => {
                  const isEditable = (cell.column as CustomColumnInstance)
                    .isEditable;
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className={`py-4 px-6 text-sm ${
                        isEditable ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataLabsTable;
