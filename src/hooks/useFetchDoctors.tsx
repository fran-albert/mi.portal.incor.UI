import { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/common/interfaces/user.interface";

const useFetchDoctors = (token: any) => {
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchDoctors() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/doctors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctors(response.data);
        setTotalDoctors(response.data.length);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const addDoctorToList = (newDoctor: IUser) => {
    setDoctors([...doctors, newDoctor]);
  };

  const updateDoctorToList = (doctorUpdated: IUser) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === doctorUpdated.id ? doctorUpdated : doctor
      )
    );
  };

  const removeDoctorFromList = (idDoctor: number) => {
    setDoctors(doctors.filter((p) => p.id !== idDoctor));
  };

  return {
    doctors,
    totalDoctors,
    isLoading,
    addDoctorToList,
    updateDoctorToList,
    removeDoctorFromList,
  };
};

export default useFetchDoctors;
