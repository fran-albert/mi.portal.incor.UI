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

interface ModalProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ChangePasswordModal({
  isOpen,
  onOpenChange,
}: ModalProps) {
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmnewPassword: "",
  });
  const [error, setError] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  function onCloseModal() {
    if (onOpenChange) {
      onOpenChange(false);
    }
    setError("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...passwordData, [e.target.name]: e.target.value };
    setPasswordData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(passwordData);
    try {
      const response = await axios.post(
        "/api/auth/change-password",
        passwordData
      );
      toast.success("Contraseña actualizada con éxito!");
      setOpenModal(false);
    } catch (error) {
      // console.error("Error al cambiar la contraseña:", error.response?.data);
      // setError(error.response?.data.message);
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
                    name="password"
                    id="password"
                    onChange={handleChange}
                    // value={password}
                    // onChange={(event) => setPassword(event.target.value)}
                  />
                  <CustomLabel htmlFor="password">Nueva contraseña</CustomLabel>
                  <CustomInput
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    // value={password}
                    onChange={handleChange}
                  />
                  <CustomLabel htmlFor="password">
                    Confirmar nueva contraseña
                  </CustomLabel>
                  <CustomInput
                    type="password"
                    name="confirmnewPassword"
                    id="confirmnewPassword"
                    // value={password}
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
