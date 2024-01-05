import { formatDate, formatearDNI, stateName } from "@/common/Utils";
import { useState } from "react";
import ChangePasswordModal from "./change.password";
import { Button, Avatar } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import LoadingPage from "@/components/Loading";
import { IUser } from "@/common/interfaces/user.interface";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";
import { State } from "@/common/interfaces/state.interface";
import EditUserModal from "./edit.user";

interface UserCardProps {
  user: IUser | undefined;
  states: State[];
  updateUser: (user: IUser) => void;
}

export default function UserCardComponent({
  user,
  states,
  updateUser,
}: UserCardProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const handleEditPassword = () => {
    setOpenModal(true);
  };

  const handleEditUser = () => {
    setOpenModalEdit(true);
  };


  if (!user || !states) {
    return <LoadingPage props="Cargando tu perfil..." />;
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center p-4 mt-36">
        <div className="relative bg-gray-200/50 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="absolute top-0 right-0 m-4">
            <Button
              isIconOnly
              variant="faded"
              className=" text-white p-2 rounded-full"
              onClick={handleEditUser}
            >
              <FaPencilAlt size={20} color="#0d9488" />
            </Button>
          </div>
          <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
            Mi Perfil
          </h1>
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
          {/* <div className="flex justify-center mb-4">
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
          </div> */}

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
                  readOnly
                  disabled
                  id="name"
                  value={user?.name || ""}
                />
              </div>
            </div>
            <div className="flex-1 pl-1">
              <div className="mb-2 block">
                <CustomLabel htmlFor="lastname">Apellido</CustomLabel>
                <CustomInput
                  name="lastname"
                  readOnly
                  disabled
                  id="lastname"
                  value={user?.lastname || ""}
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
                  readOnly
                  disabled
                  id="phone"
                  value={user?.phone || ""}
                />
              </div>
            </div>
            <div className="flex-1 pl-1">
              <div className="mb-2 block">
                <CustomLabel htmlFor="healthInsurance">Obra Social</CustomLabel>
                <CustomInput
                  name="healthInsurance"
                  readOnly
                  disabled
                  id="healthInsurance"
                  value={user?.healthInsurance || ""}
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
                <CustomLabel htmlFor="state">Provincia</CustomLabel>

                <CustomInput
                  name="state"
                  id="state"
                  readOnly
                  disabled
                  value={user?.city && stateName(states, user.city.idState)}
                />
              </div>
            </div>
            <div className="flex-1 pl-1">
              <div className="mb-2 block">
                <CustomLabel htmlFor="city">Localidad</CustomLabel>
                <CustomInput
                  name="city"
                  id="city"
                  readOnly
                  disabled
                  value={user?.city?.city || ""}
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
                readOnly
                disabled
                value={user?.email || ""}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="mx-2">
              <Button
                className="bg-teal-600 font-medium"
                radius="md"
                onClick={handleEditPassword}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={openModal}
        onOpenChange={setOpenModal}
        user={user}
      />
      <EditUserModal
        isOpen={openModalEdit}
        onOpenChange={setOpenModalEdit}
        user={user}
        provincias={states}
      />
    </>
  );
}
