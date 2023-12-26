"use client";

import SideBar from "@/components/SideBar";
import UserCardComponent from "./userCard";

const Profile = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 w-full">
          <SideBar />
        </div>
        <div className="flex-grow">
          <UserCardComponent />
        </div>
      </div>
    </>
  );
};
export default Profile;
