// hooks/useFetchUser.js
import { useState, useEffect } from "react";
import axios from "axios";

const useFetchUser = (token: any, idPatient: number) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${idPatient}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && idPatient) {
      fetchUser();
    }
  }, [token, idPatient]);

  return { user, isLoading };
};

export default useFetchUser;
