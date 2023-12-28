"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, Divider, Checkbox } from "@nextui-org/react";
import { EyeFilledIcon } from "../../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../components/EyeSlashFilledIcon";
import SideBar from "@/components/SideBar";
import { CustomInput } from "@/components/ui/Input";
import { CustomLabel } from "@/components/ui/Label";

function LoginPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("fraan@gmail.com");
  const [password, setPassword] = useState("43282913");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/home");
  };

  useEffect(() => {
    if (session?.user) {
      router.push("/home");
    }
  }, [session, router]);

  return (
    <>
      <div className="flex items-start justify-center p-2">
        <div className="bg-gray-100 p-4 md:p-14 rounded-lg shadow-md w-full md:max-w-lg">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-lg md:text-2xl font-bold text-center">
              Iniciar Sesión
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-wrap gap-2">
                <CustomLabel htmlFor="email">Correo Electrónico</CustomLabel>
                <CustomInput
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="flex w-full flex-wrap gap-2">
                <CustomLabel htmlFor="password">Password</CustomLabel>
                <CustomInput
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="alert alert-danger mt-2">
                <ul className="mb-0 text-red-500">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

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
              <a href="/forgot-password" className="text-teal-500 hover:text-teal-600">
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
