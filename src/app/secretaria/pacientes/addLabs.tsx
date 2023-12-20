import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { startOfDay } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { formatDate } from "@/common/Utils";
import { ModalProps } from "@/common/interfaces/modal.addLabs.interface";
import MyDatePicker from "@/components/DatePicker";

export interface Patient {
  name: string;
  email: string;
  fechaAnalisis: string;
}

registerLocale("es", es);

export default function AddModalLabs({
  isOpen,
  onOpenChange,
  paciente,
  onLaboratorioAdded,
}: ModalProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [file, setFile] = useState<File | null>(null);
  const { data: session, status } = useSession();
  const user = session?.user;
  const [error, setError] = useState<string>("");
  const isoDate = selectedDate.toISOString();

  function onCloseModal() {
    onOpenChange(false);
    setError("");
  }

  const sendEmail = async ({ email, name, fechaAnalisis }: Patient) => {
    try {
      const response = await axios.post("/api/send", {
        email: email,
        nombre: name,
        fecha: fechaAnalisis,
      });
    } catch (error) {
      console.error("Exception caught:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, suba un archivo.");
      return;
    }

    const analysisTypeElement = document.getElementById("analysisType");
    if (!analysisTypeElement) {
      console.error("Elemento 'analysisType' no encontrado.");
      return;
    }
    const analysisTypeValue = (analysisTypeElement as HTMLInputElement).value;

    const formData = new FormData();
    formData.append("analysisType", analysisTypeValue);
    formData.append("selectedDate", selectedDate.toISOString());
    formData.append("file", file);
    formData.append("idPaciente", paciente.id);
    formData.append("fecha", isoDate);
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Laboratorio agregado con éxito!");
        if (onLaboratorioAdded) {
          onLaboratorioAdded(response.data);
        }
        const patientInfo = {
          email: paciente.email,
          name: paciente.name,
          fechaAnalisis: formatDate(isoDate),
        };
        sendEmail(patientInfo);
        onCloseModal();
      } else {
        console.error("Error response from server:", response);
        toast.error("Ocurrió un error al agregar el laboratorio.");
      }
    } catch (error) {
      console.error("Exception caught:", error);
      toast.error("Ocurrió un error al agregar el laboratorio.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onClose={onCloseModal} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Laboratorio para {paciente?.name} {paciente?.lastname}
              </ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}

                  <div className="flex flex-row">
                    <div className="flex-1 pl-1">
                      <label htmlFor="">
                        <span className="text-gray-700">Fecha de Análisis</span>
                      </label>
                      <MyDatePicker
                        selectedDate={selectedDate}
                        onChange={(date: Date | null) => {
                          if (date) setSelectedDate(date);
                        }}
                      />
                      <div className="flex-1 pr-1">
                        <label htmlFor="">
                          <span className="text-gray-700">
                            Tipo de Análisis
                          </span>
                        </label>
                        <div className="mb-2 block">
                          <Input
                            color="default"
                            name="analysisType"
                            id="analysisType"
                            radius="lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex flex-col mb-4">
                    <DatePicker
                      id="fechaNacimiento"
                      name="fecha_nac"
                      dateFormat="dd/MM/yyyy"
                      selected={selectedDate}
                      onChange={(date) => date && setSelectedDate(date)}
                      locale="es"
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                  </div> */}
                  <div>
                    <label htmlFor="">
                      <span className="text-gray-700">Documento PDF</span>
                    </label>
                    <input
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      id="fileInput"
                      type="file"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button className="bg-teal-500" type="submit">
                    Agregar
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
