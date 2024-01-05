"use client";
import { formatDate, formatearDNI, stateName } from "@/common/Utils";
import { Avatar } from "@nextui-org/react";
import { HiIdentification, HiPhone } from "react-icons/hi2";
import { MdMail, MdHealthAndSafety } from "react-icons/md";
import { FaCalendar, FaAddressBook } from "react-icons/fa";
import HeaderPatient from "@/components/ui/Header";
import LoadingPage from "@/components/Loading";

export default function UserProfileCard({ paciente, provincia }: any) {
  if (!paciente || !provincia) {
    return <LoadingPage props={"Cargando datos del paciente..."} />;
  }

  return (
    <>
      <HeaderPatient user={paciente} />
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-base sm:text-lg lg:text-xl">
              <div className="flex items-center">
                <HiIdentification className="h-5 w-5 text-gray-500 mr-2" />
                <p>DNI: {formatearDNI(paciente?.dni)}</p>
              </div>

              <div className="flex items-center">
                <HiPhone className="h-5 w-5 text-gray-500 mr-2" />
                <p>Contacto: {paciente?.phone}</p>
              </div>

              <div className="flex items-center">
                <MdMail className="h-5 w-5 text-gray-500 mr-2" />
                <p>Correo: {paciente?.email}</p>
              </div>

              <div className="flex items-center">
                <FaCalendar className="h-5 w-5 text-gray-500 mr-2" />
                <p>Fecha de Nacimiento: {formatDate(paciente?.birthDate)}</p>
              </div>

              <div className="flex items-center">
                <FaAddressBook className="h-5 w-5 text-gray-500 mr-2" />
                <p>
                  Domicilio: {stateName(provincia, paciente?.city.idState)},{" "}
                  {paciente?.city.city}
                </p>
              </div>

              <div className="flex items-center">
                <MdHealthAndSafety className="h-5 w-5 text-gray-500 mr-2" />
                <p>Obra Social: {paciente?.healthInsurance}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
