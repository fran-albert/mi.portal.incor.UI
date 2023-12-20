import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ModalProps } from "@/common/interfaces/modal.addLabs.interface";
import { useCustomSession } from "@/context/SessionAuthProviders";

export default function DeleteDoctorModal({
  isOpen,
  onOpenChange,
  doctor,
  onDoctorRemoved,
}: ModalProps) {
  const [error, setError] = useState<string>("");
  const { session } = useCustomSession();
  function onCloseModal() {
    onOpenChange(false);
    setError("");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${doctor.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Medico eliminado con éxito!");
        onCloseModal();
        if (onDoctorRemoved) {
          onDoctorRemoved(doctor.id);
        }
      } else {
        console.error("Error response from server:", response);
        toast.error("Ocurrió un error al eliminar el medico.");
      }
    } catch (error) {
      console.error("Exception caught:", error);
      toast.error("Ocurrió un error al eliminar el medico.");
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
                Eliminar Médico
              </ModalHeader>
              <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit}>
                <ModalBody>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-20 w-20 text-gray-400" />
                    <h3 className="mb-5 text-xl font-normal text-gray-600">
                      Estás seguro de eliminar a <br /> {doctor?.lastname},{" "}
                      {doctor?.name}?
                    </h3>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button className="bg-teal-500" type="submit">
                    Confirmar
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
