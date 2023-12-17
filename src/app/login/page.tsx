"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, Divider, Checkbox } from "@nextui-org/react";
import { EyeFilledIcon } from "../../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../components/EyeSlashFilledIcon";
import { FaCheckCircle } from "react-icons/fa";

function LoginPage() {
  // const [error, setError] = useState();
  // const router = useRouter();
  // const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // useEffect(() => {
  //   if (session?.user) {
  //     router.push("/home");
  //   }
  // }, [session, router]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);
  //   const res = await signIn("credentials", {
  //     redirect: false,
  //     email: formData.get("email"),
  //     password: formData.get("password"),
  //   });

  //   if (res?.error) {
  //     return setError(res.error);
  //   }

  //   if (res?.ok) return router.push("/home");
  // };
  return (
    <>
      <div className="flex items-start justify-center p-2">
        <div className="bg-gray-100 p-4 md:p-14 rounded-lg shadow-md w-full md:max-w-lg">
          <form className="flex flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold text-center">
              Iniciar Sesión
            </h1>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                type="email"
                id="email"
                name="email"
                color="default"
                label="Correo Electrónico"
                required
                variant="faded"
                placeholder="Ingrese su correo electrónico"
                classNames={{
                  label: "text-black/50 ",
                  input: ["bg-transparent", "text-black/90 "],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-white-500/50",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "!cursor-text",
                    "hover:bg-white-500/50",
                    "focus:bg-white-500/50",
                    "group-data-[focused=true]:bg-white-500/50",
                  ],
                }}
              />
            </div>
            <div>
              <Input
                label="Contraseña"
                id="password"
                name="password"
                required
                placeholder="Ingrese su contraseña"
                variant="faded"
                classNames={{
                  label: "text-black/50 ",
                  input: ["bg-transparent", "text-black/90 "],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-white-500/50",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "!cursor-text",
                    "hover:bg-white-500/50",
                    "focus:bg-white-500/50",
                    "group-data-[focused=true]:bg-white-500/50",
                  ],
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            </div>
            {/* {error && <div className="text-red-500 pb-4">{error}</div>} */}

            <Checkbox defaultSelected radius="md">
              Recordarme
            </Checkbox>
            <Button
              type="submit"
              radius="md"
              className="bg-teal-500 mx-auto w-1/2 md:w-1/2"
            >
              Ingresar
            </Button>
            <Divider />
            <div className="text-center">
              <a href="#" className="text-teal-500 hover:text-teal-600">
                ¿Has olvidado tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;