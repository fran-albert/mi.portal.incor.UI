"use client";
import HeaderPatient from "@/components/ui/Header";

export default function PatientStudies({ paciente, provincia }: any) {
  return (
    <>
      <HeaderPatient user={paciente} />
      <div className="py-6">
        <p className="ml-2 text-center">Página en Construcción</p>
      </div>
    </>
  );
}
