import { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/common/interfaces/user.interface";

const useFetchProfile = (token: any) => {
  const [profile, setProfile] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { profile, isLoading };
};

export default useFetchProfile;
