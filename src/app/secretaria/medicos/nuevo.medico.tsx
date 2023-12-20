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
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ModalProps } from "@/common/interfaces/modal.addLabs.interface";
import MyDatePicker from "@/components/DatePicker";
import { useCustomSession } from "@/context/SessionAuthProviders";
registerLocale("es", es);

export default function NewPatientModal({ isOpen, onOpenChange }: ModalProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [error, setError] = useState<string>("");
  const { session } = useCustomSession();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phone: "",
    dni: "",
    birthDate: null,
    healthInsurance: "",
    email: "",
    role: ["Médico"],
    idCity: 1961,
    photo: null,
  });

  function onCloseModal() {
    onOpenChange(false);
    resetForm();
    setError("");
  }

  function resetForm() {
    setFormData({
      name: "",
      lastname: "",
      phone: "",
      dni: "",
      birthDate: null,
      healthInsurance: "",
      email: "",
      role: ["Médico"],
      idCity: 1961,
      photo: null,
    });
    setSelectedDate(startOfDay(new Date()));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      birthDate: selectedDate,
      role: ["Médico"],
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Médico agregado con éxito!");
        onCloseModal();
      } else {
        console.error("Error response from server:", response);
        setError("Ocurrió un error al agregar el medico.");
      }
    } catch (error) {
      console.error("Exception caught:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message ||
            "Ocurrió un error al agregar el medico."
        );
      } else {
        setError("Ocurrió un error al agregar el medico.");
      }
    }
  };
  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Médico
              </ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <Input
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                        label="Nombre"
                        required
                        type="text"
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <Input
                        autoFocus
                        label="Apellido"
                        value={formData.lastname}
                        onChange={handleChange}
                        name="lastname"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <Input
                        autoFocus
                        label="Teléfono"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <Input
                        autoFocus
                        label="D.N.I"
                        type="number"
                        value={formData.dni}
                        onChange={handleChange}
                        name="dni"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <Input
                        label="Correo Electrónico"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        required
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <Input
                        autoFocus
                        label="Obra Social"
                        type="text"
                        value={formData.healthInsurance}
                        onChange={handleChange}
                        name="healthInsurance"
                        required
                      />
                    </div>
                  </div>
                  <MyDatePicker
                    selectedDate={selectedDate}
                    onChange={(date: Date | null) => {
                      if (date) setSelectedDate(date);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
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
