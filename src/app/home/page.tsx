"use client";
import { useSession } from "next-auth/react";
import SideBar from "@/components/SideBar";
import WelcomeCardComponent from "./welcomeCard";
import withSessionTimeout from "@/components/WithSessionTimeout";

function HomePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 w-full">
          <SideBar />
        </div>
        <div className="flex-grow mt-40">
          {status === "authenticated" && user && (
            <WelcomeCardComponent user={user} />
          )}
        </div>
      </div>
    </>
  );
}

export default withSessionTimeout(HomePage);

