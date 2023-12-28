"use client";

import { formatDate, formatearDNI } from "@/common/Utils";
import { useEffect, useState } from "react";
import axios from "axios";
import ChangePasswordModal from "./change.password";
import { Button, Avatar } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "@/components/Loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { IUser } from "@/common/interfaces/user.interface";
import { FaCamera } from "react-icons/fa";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";

export default function UserCardComponent() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [provincias, setProvincias] = useState([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const { session } = useCustomSession();

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setUser(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("lastname", user.lastname);
    formData.append("phone", user.phone);
    formData.append("email", user.email);
    // formData.append('birthDate', user.birthDate); // Asegúrate de que la fecha esté en el formato adecuado

    // Si la ciudad es un ID o un objeto, ajusta esto según lo que tu backend necesite
    // formData.append('city', user.city.city);
    // formData.append('healthInsurance', user.healthInsurance);

    // Solo agrega la foto si el archivo está presente
    if (file) {
      formData.append("photo", file);
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      // Aquí se debe manejar la respuesta del servidor.
      // Si response.data no es el usuario, entonces necesitas ajustar el servidor o el manejo de la respuesta aquí.
      if (response.data && !response.data.generatedMaps) {
        setUser(response.data); // Asegúrate de que response.data es el objeto de usuario que esperas
        toast.success("Perfil actualizado correctamente");
      } else {
        // Manejar la posibilidad de que response.data no contenga los datos del usuario
        console.error(
          "Datos inesperados recibidos del servidor:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  const handleEdit = () => {
    setOpenModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((currentUser) => {
      // Si currentUser es undefined, simplemente salimos de la función.
      if (currentUser === undefined) return undefined;

      // De otra manera, actualizamos currentUser asegurándonos de que todas las propiedades necesarias están presentes.
      return {
        ...currentUser,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  if (isLoading) {
    return <LoadingPage props="Cargando tu perfil..." />;
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center p-4 mt-36">
        <div className="bg-gray-200 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
          <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
            Mi Perfil
          </h1>
          <form onSubmit={handleSubmit}>
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

            <h2 className="text-xl font-medium text-center mb-2 text-gray-700">
              {user?.name} {user?.lastname}
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              {user?.role ? user.role.join(" - ") : "No roles"}
            </p>

            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block ">
                  <CustomLabel htmlFor="name">Nombre</CustomLabel>
                  <CustomInput
                    name="name"
                    id="name"
                    value={user?.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="lastname">Apellido</CustomLabel>
                  <CustomInput
                    name="lastname"
                    id="lastname"
                    value={user?.lastname || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="phone">Teléfono</CustomLabel>
                  <CustomInput
                    name="phone"
                    id="phone"
                    value={user?.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="healthInsurance">
                    Obra Social
                  </CustomLabel>
                  <CustomInput
                    name="healthInsurance"
                    id="healthInsurance"
                    value={user?.healthInsurance || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="dni">D.N.I</CustomLabel>
                  <CustomInput
                    disabled
                    name="dni"
                    readOnly
                    id="dni"
                    defaultValue={user?.dni ? formatearDNI(user.dni) : ""}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="birthdate">
                    Fecha de Nacimiento
                  </CustomLabel>
                  <CustomInput
                    name="birthdate"
                    id="birthdate"
                    readOnly
                    disabled
                    value={user?.birthDate ? formatDate(user.birthDate) : ""}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="city">Localidad</CustomLabel>
                  <CustomInput
                    name="city"
                    id="city"
                    onChange={handleInputChange}
                    value={user?.city?.city || ""}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <CustomLabel htmlFor="state">Provincia</CustomLabel>
                  <CustomInput
                    name="state"
                    id="state"
                    onChange={handleInputChange}
                    value={user?.city?.idState || ""}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <CustomLabel htmlFor="apellido">Correo Electrónico</CustomLabel>
                <CustomInput
                  name="email"
                  id="email"
                  value={user?.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="mx-2">
                <Button className="bg-teal-600" radius="md" type="submit">
                  Editar Datos
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  className="bg-teal-600"
                  radius="md"
                  onClick={handleEdit}
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ChangePasswordModal isOpen={openModal} onOpenChange={setOpenModal} user={user} />
    </>
  );
}
