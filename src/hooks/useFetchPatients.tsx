import { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/common/interfaces/user.interface";

const useFetchPacientes = (token: any) => {
  const [pacientes, setPacientes] = useState<IUser[]>([]);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchPacientes() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPacientes(response.data);
        setTotalPatients(response.data.length);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      fetchPacientes();
    }
  }, [token]);

  const addPatientToList = (newPatient: IUser) => {
    setPacientes((currentPatients) => [...currentPatients, newPatient]);
  };

  const updatePacienteToList = (pacienteUpdated: IUser) => {
    setPacientes(
      pacientes.map((paciente) =>
        paciente.id === pacienteUpdated.id ? pacienteUpdated : paciente
      )
    );
  };

  const removePatientFromList = (idPaciente: number) => {
    setPacientes(pacientes.filter((p) => p.id !== idPaciente));
  };

  return {
    pacientes,
    totalPatients,
    isLoading,
    addPatientToList,
    updatePacienteToList,
    removePatientFromList,
  };
};

export default useFetchPacientes;
