import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
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
import { FaCamera } from "react-icons/fa";

registerLocale("es", es);

export default function EditUserModal({
  isOpen,
  onOpenChange,
  provincias,
  user,
}: ModalProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
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
    setSelectedDate(startOfDay(new Date()));
    setSelectedState("");
    setSelectedCity("");
    setFormData({
      name: "",
      lastname: "",
      phone: "",
      dni: "",
      birthDate: null,
      healthInsurance: "",
      email: "",
      idCity: "",
      photo: "",
    });
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
    if (isOpen && user) {
      const birthDate = user.birthDate ? new Date(user.birthDate) : new Date();
      setSelectedDate(birthDate);
      setSelectedState(user.city.idState.toString());
      setSelectedCity(user.city.id.toString());
      fetchCitiesByState(user.city.idState.toString());
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        phone: user.phone || "",
        dni: user.dni || "",
        healthInsurance: user.healthInsurance || "",
        email: user.email || "",
        idCity: user.city.id.toString() || "",
        photo: user.photo || "",
        birthDate: birthDate,
      });
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedState) {
      fetchCitiesByState(selectedState);
    }
  }, [selectedState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("lastname", formData.lastname);
    dataToSend.append("phone", formData.phone);
    dataToSend.append("dni", formData.dni);
    dataToSend.append("healthInsurance", formData.healthInsurance);
    dataToSend.append("email", formData.email);
    dataToSend.append("birthDate", selectedDate.toISOString());
    dataToSend.append("idCity", selectedCity.toString());

    if (file) {
      dataToSend.append("file", file);
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Datos actualizados con éxito!");
        // if (onPatientUpdated) {
        //   onPatientUpdated(response.data);
        // }
        onCloseModal();
      } else {
        setError("Ocurrió un error al actualizar el paciente.");
      }
    } catch (error) {
      setError("Ocurrió un error al actualizar el paciente.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);

      // Aquí deberías enviar la solicitud HTTP para cargar la imagen
      // Por ejemplo: axios.post('/api/upload', formData);
    }
  };

  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar</ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex justify-center mb-4">
                    <Avatar
                      src={
                        previewUrl ||
                        (user?.photo
                          ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${user?.photo}`
                          : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png")
                      }
                      className="w-20 h-20 text-large"
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Button
                      isIconOnly
                      variant="faded"
                      aria-label="Take a photo"
                      onClick={() => {
                        const fileInput = document.getElementById("file");
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <FaCamera size={20} color="#0d9488" />
                    </Button>
                  </div>

                  <div className="flex flex-row">
                    <div className="flex-1 pr-1">
                      <CustomLabel htmlFor="name">Nombre</CustomLabel>
                      <CustomInput
                        name="name"
                        type="text"
                        id="name"
                        defaultValue={user?.name}
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
                        defaultValue={user?.lastname}
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
                        defaultValue={user?.phone}
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
                        defaultValue={user?.dni}
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
                        defaultValue={user?.healthInsurance}
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
                    defaultValue={user?.email}
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
