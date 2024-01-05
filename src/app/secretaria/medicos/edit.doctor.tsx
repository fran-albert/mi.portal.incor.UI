import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { ModalProps } from "@/common/interfaces/modal.addLabs.interface";
import { CustomLabel } from "@/components/ui/Label";
import { CustomInput } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/Select";
import { IFormData } from "@/common/interfaces/form.data.interface";

registerLocale("es", es);

export default function EditDoctorModal({
  isOpen,
  onOpenChange,
  provincias,
  doctor,
  onDoctorUpdated,
}: ModalProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>("");
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    lastname: "",
    phone: "",
    dni: "",
    birthDate: null,
    healthInsurance: "",
    email: "",
    idCity: selectedCity,
    photo: "",
  });
  const [selectedState, setSelectedState] = useState<string>("");

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
      idCity: selectedCity,
      photo: "",
    });
    setSelectedDate(startOfDay(new Date()));
  }

  const fetchCitiesByState = async (stateId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cities/byState/${stateId}`
      );
      const cityOptions = response.data.map((city: any) => ({
        value: city.id.toString(),
        label: city.city,
      }));
      setCitiesOptions(cityOptions);
    } catch (error) {
      console.error("Error al cargar las ciudades:", error);
      setCitiesOptions([]);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const statesOptions = provincias
    ? provincias?.map((provincia) => ({
        value: provincia.id.toString(),
        label: provincia.state,
      }))
    : [];

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
    fetchCitiesByState(event.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (isOpen && doctor) {
      const birthDate = doctor.birthDate
        ? new Date(doctor.birthDate)
        : new Date();
      setSelectedDate(birthDate);
      setSelectedState(doctor.city.idState.toString());
      setSelectedCity(doctor.city.id.toString());
      fetchCitiesByState(doctor.city.idState.toString());
      setFormData({
        name: doctor.name || "",
        lastname: doctor.lastname || "",
        phone: doctor.phone || "",
        dni: doctor.dni || "",
        healthInsurance: doctor.healthInsurance || "",
        email: doctor.email || "",
        idCity: doctor.city.id.toString() || "",
        photo: doctor.photo || "",
        birthDate: birthDate,
      });
    }
  }, [isOpen, doctor]);

  useEffect(() => {
    if (selectedState) {
      fetchCitiesByState(selectedState);
    }
  }, [selectedState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      birthDate: selectedDate,
      idCity: parseInt(selectedCity),
    };
    console.log(dataToSend);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${doctor?.id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Datos actualizados con éxito!");
        if (onDoctorUpdated) {
          onDoctorUpdated(response.data);
        }
        onCloseModal();
      } else {
        setError("Ocurrió un error al actualizar el paciente.");
      }
    } catch (error) {
      console.error("Exception caught:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message ||
            "Ocurrió un error al agregar el paciente."
        );
      } else {
        setError("Ocurrió un error al agregar el paciente.");
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
                Editar Médico
              </ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="name">Nombre</CustomLabel>
                      <CustomInput
                        name="name"
                        type="text"
                        id="name"
                        defaultValue={doctor?.name}
                        // value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <CustomLabel htmlFor="lastname">Apellido</CustomLabel>
                      <CustomInput
                        name="lastname"
                        id="lastname"
                        type="text"
                        defaultValue={doctor?.lastname}
                        // value={formData.lastname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="phone">Teléfono</CustomLabel>
                      <CustomInput
                        name="phone"
                        type="text"
                        id="phone"
                        defaultValue={doctor?.phone}
                        // value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <CustomLabel htmlFor="dni">D.N.I</CustomLabel>
                      <CustomInput
                        name="dni"
                        id="dni"
                        type="text"
                        defaultValue={doctor?.dni}
                        // value={formData.dni}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="state">
                        Fecha de Nacimiento
                      </CustomLabel>
                      <DatePicker
                        selected={selectedDate}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date: Date | null) => {
                          if (date) setSelectedDate(date);
                        }}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <CustomLabel htmlFor="healthInsurance">
                        Obra Social
                      </CustomLabel>
                      <CustomInput
                        name="healthInsurance"
                        id="healthInsurance"
                        type="text"
                        // value={formData.healthInsurance}
                        defaultValue={doctor?.healthInsurance}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="state">Provincia</CustomLabel>
                      <CustomSelect
                        options={statesOptions}
                        value={selectedState || ""}
                        onChange={handleStateChange}
                      />
                    </div>
                    <div className="flex-1 pl-1">
                      <CustomLabel htmlFor="city">Localidad</CustomLabel>
                      <CustomSelect
                        options={citiesOptions}
                        value={selectedCity}
                        onChange={handleCityChange}
                      />
                    </div>
                  </div>
                  <CustomLabel htmlFor="email">Correo Electrónico</CustomLabel>
                  <CustomInput
                    name="email"
                    id="email"
                    type="email"
                    // value={formData.email}
                    defaultValue={doctor?.email}
                    onChange={handleChange}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button className="bg-teal-500" type="submit">
                    Confimar
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
