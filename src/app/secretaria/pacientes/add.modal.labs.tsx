import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { startOfDay } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendar } from "react-icons/fa";
import { ModalProps } from "@/common/interfaces/modal.addLabs.interface";
import { CustomLabel } from "@/components/ui/Label";
import { CustomInput } from "@/components/ui/Input";

export interface Patient {
  name: string;
  email: string;
  fechaAnalisis: string;
}

interface FormDataLabs {
  id: number;
  name: string;
  date: Date;
  file: string;
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
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormDataLabs>({
    id: paciente?.id,
    name: "",
    date: selectedDate,
    file: "",
  });

  function onCloseModal() {
    onOpenChange(false);
    resetForm();
    setError("");
  }

  function resetForm() {
    setFormData({
      id: paciente.id,
      name: "",
      date: selectedDate,
      file: "",
    });
    setSelectedDate(startOfDay(new Date()));
    setFile(null);
  }

  // const sendEmail = async ({ email, name, fechaAnalisis }: Patient) => {
  //   try {
  //     const response = await axios.post("/api/send", {
  //       email: email,
  //       nombre: name,
  //       fecha: fechaAnalisis,
  //     });
  //   } catch (error) {
  //     console.error("Exception caught:", error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, suba un archivo.");
      return;
    }

    const dataToSend = {
      file: file,
      name: formData.name,
      date: formData.date,
      idPatient: paciente.id,
    };

    toast
      .promise(
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/labs`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Agregando laboratorio...",
          success: "Laboratorio agregado con éxito!",
          error: "Ocurrió un error al agregar el laboratorio.",
        }
      )
      .then((response) => {
        if (onLaboratorioAdded) {
          onLaboratorioAdded(response.data);
        }
        const patientInfo = {
          email: paciente.email,
          name: paciente.name,
          fechaAnalisis: formData.date,
        };
        // sendEmail(patientInfo);
        onCloseModal();
      })
      .catch((error) => {
        console.error("Exception caught:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onClose={onCloseModal} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar laboratorio a {paciente?.name}
              </ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="state">
                        Fecha del Laboratorio
                      </CustomLabel>
                      <DatePicker
                        showIcon
                        selected={selectedDate}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date: Date | null) => {
                          if (date) setSelectedDate(date);
                        }}
                        icon={<FaCalendar color="#0d9488" />}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <CustomLabel htmlFor="healthInsurance">
                        Tipo de Análisis
                      </CustomLabel>
                      <CustomInput
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleChange}
                        value={formData.name}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="">
                      <span className="text-gray-700">Documento PDF</span>
                    </label>
                    <input
                      onChange={handleFileChange}
                      name="file"
                      className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      id="file"
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
