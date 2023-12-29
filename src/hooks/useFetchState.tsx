import { useState, useEffect } from "react";
import axios from "axios";
import { State } from "@/common/interfaces/state.interface";

const useFetchStates = (token: any) => {
  const [states, setStates] = useState<Array<State>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchStates() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/states`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStates(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      fetchStates();
    }
  }, [token]);

  return { states, isLoading };
};

export default useFetchStates;
