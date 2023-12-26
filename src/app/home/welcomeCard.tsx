import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Avatar,
  Image,
} from "@nextui-org/react";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { FaHeartbeat, FaSmile } from "react-icons/fa";
import axios from "axios";

interface User {
  email: string;
  token: string;
  id: number;
}

interface WelcomeCardComponentProps {
  user: User;
}

interface Profile {
  name?: string;
  lastname?: string;
  photo?: string;
}
const WelcomeCardComponent: React.FC<WelcomeCardComponentProps> = () => {
  const { session } = useCustomSession();
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  return (
    <>
      <div className="flex justify-center items-center mx-4 sm:mx-auto">
        <Card className="w-full max-w-2xl bg-gray-100 shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-100 flex items-center gap-4 p-4">
            <Avatar
              alt="Avatar del paciente"
              radius="sm"
              src={
                profile.photo
                  ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${profile.photo}`
                  : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png"
              }
              className="w-20 h-20"
            />{" "}
            <div>
              <p className="text-2xl font-semibold text-teal-700">
                Hola, {profile.name}!
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-4">
            <div className="flex flex-col items-center gap-4">
              <FaHeartbeat className="text-red-500" size={30} />
              <p className="text-center text-lg text-gray-900">
                Desde INCOR estamos comprometidos con tu salud y bienestar.{" "}
                <br /> ¡Te deseamos un día lleno de energía y salud!
              </p>
              <FaSmile className="text-yellow-400" size={30} />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default WelcomeCardComponent;
