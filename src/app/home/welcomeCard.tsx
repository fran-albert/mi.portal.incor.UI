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
import { useSession } from "next-auth/react";
import { FaHeartbeat, FaSmile } from "react-icons/fa";

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
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      setError("Error fetching profile");
    }
  };
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
                  ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${profile.photo}.jpeg`
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
