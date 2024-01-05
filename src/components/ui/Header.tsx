import { Avatar } from "@nextui-org/react";
import React from "react";

function HeaderPatient({ user }: { user: any }) {
  return (
    <header className="shadow-lg rounded-lg bg-teal-600/50">
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
            className="sm:w-20 sm:h-20 lg:w-20 lg:h-20"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 text-center sm:text-left">
          {user?.lastname}, {user?.name}
        </h1>
      </div>
    </header>
  );
}

export default HeaderPatient;
