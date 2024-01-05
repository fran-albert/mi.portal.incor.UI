"use client";

import SideBar from "@/components/SideBar";
import UserCardComponent from "./userCard";
import { useEffect, useState } from "react";
import { IUser } from "@/common/interfaces/user.interface";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchStates from "@/hooks/useFetchState";
import useFetchProfile from "@/hooks/useFetchProfile";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { session } = useCustomSession();
  const { states: provincias, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );
  const { profile, isLoading: isProfileLoading } = useFetchProfile(
    session?.user?.token
  );

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 w-full">
          <SideBar />
        </div>
        <div className="flex-grow">
          <UserCardComponent
            user={user}
            states={provincias}
            updateUser={updateUser}
          />
        </div>
      </div>
    </>
  );
};
export default Profile;
