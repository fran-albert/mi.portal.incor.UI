import { Avatar } from "@nextui-org/react";
import React from "react";
import { formatearDNI, formatDate, stateName } from "@/common/Utils";

function HeaderPatient({ user }: { user: any }) {
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = user?.birthDate ? calculateAge(user.birthDate) : "Desconocida";

  return (
    <header className="shadow-lg rounded-lg bg-teal-600 text-white mt-40 m-4">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-center items-center flex-col sm:flex-row">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
          <Avatar
            alt="Avatar del paciente"
            radius="full"
            src={
              user?.photo
                ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${user?.photo}`
                : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png"
            }
            className="w-24 h-24 lg:w-28 lg:h-28"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
            {user?.lastname}, {user?.name}
          </h1>
          <div className="mt-2 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col space-y-1">
              <span className="block text-lg lg:text-xl">{age} años</span>
              <span className="block text-lg lg:text-xl">
                Obra Social: {user?.healthInsurance || "No especificado"}
              </span>
              <span className="block text-lg lg:text-xl">
                DNI: {formatearDNI(user?.dni) || "No especificado"}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="block text-lg lg:text-xl">
                Email: {user?.email || "No especificado"}
              </span>
              <span className="block text-lg lg:text-xl">
                Fecha de Nacimiento:{" "}
                {formatDate(user?.birthDate) || "No especificada"}
              </span>
              <span className="block text-lg lg:text-xl">
                {/* Domicilio: {stateName(provincia, user?.city.idState)},{" "}
                {user?.city.city} */}
                Domicilio: {user?.city.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderPatient;
