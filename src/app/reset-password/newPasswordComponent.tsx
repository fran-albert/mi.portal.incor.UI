"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const NewPasswordComponent = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("Token de restablecimiento no proporcionado.");
      return;
    }

    toast
      .promise(
        axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
          { resetPasswordToken: token, password: password }
        ),
        {
          loading: "Enviando solicitud de restablecimiento...",
          success: (data) => {
            setTimeout(() => router.push("/"), 2000);
            return "Contraseña actualizada con éxito!";
          },
          error: "Ocurrió un error al actualizar la contraseña.",
        }
      )
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(["Ocurrió un error al intentar actualizar la contraseña."]);
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
              Ingrese su nueva contraseña
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-wrap gap-2">
                <CustomLabel htmlFor="password">Contraseña</CustomLabel>
                <CustomInput
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

export default NewPasswordComponent;
