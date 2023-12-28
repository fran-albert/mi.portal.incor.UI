"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";
import { useCustomSession } from "@/context/SessionAuthProviders";

interface ModalProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  user: any;
}

export default function ChangePasswordModal({
  isOpen,
  onOpenChange,
  user,
}: ModalProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { session } = useCustomSession();

  function onCloseModal() {
    if (onOpenChange) {
      onOpenChange(false);
    }
    setError("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/change-password/${user.id}`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      toast.success("Contraseña actualizada con éxito!");
      onCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al cambiar la contraseña:", error.response.data);
        setError(error.response.data.message || "Error desconocido");
      } else {
        console.error("Error al cambiar la contraseña:", error);
      }
      toast.error("Ocurrió un error al cambiar la contraseña.");
    }
  };

  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Cambiar Contraseña</ModalHeader>
              <form
                className="flex max-w-md flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <CustomLabel htmlFor="password">
                    Contraseña actual
                  </CustomLabel>
                  <CustomInput
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    onChange={handleChange}
                  />
                  <CustomLabel htmlFor="password">Nueva contraseña</CustomLabel>
                  <CustomInput
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    onChange={handleChange}
                  />
                  <CustomLabel htmlFor="password">
                    Confirmar nueva contraseña
                  </CustomLabel>
                  <CustomInput
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
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
