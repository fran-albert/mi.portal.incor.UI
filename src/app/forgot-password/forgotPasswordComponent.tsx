"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgotPasswordComponent = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast
      .promise(
        axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/request-reset-password`,
          { email: email }
        ),
        {
          loading: "Enviando correo...",
          success: (data) => {
            setTimeout(() => router.push("/"), 2000);
            return "Correo enviado con éxito!";
          },

          error: "Ocurrió un error al enviar el correo.",
        }
      )
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(["Ocurrió un error al intentar enviar la solicitud."]);
        }
      });
  };

  return (
    <>
      <Toaster />
      <div className="flex items-start justify-center">
        <div className="bg-gray-100 md:p-14 rounded-lg shadow-md w-full md:max-w-lg">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-lg md:text-2xl font-bold text-center">
              Restablecer contraseña
            </h1>
            <p>Enviaremos un enlace para restablecer su contraseña.</p>
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-wrap gap-2">
                <CustomLabel htmlFor="email">
                  Ingrese su correo electrónico
                </CustomLabel>
                <CustomInput
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              radius="md"
              className="bg-teal-500 mx-auto w-1/2 md:w-1/2"
            >
              Confirmar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordComponent;
