"use client";
import SideBar from "@/components/SideBar";
import UserProfileCard from "./user.profile.card";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import LoadingPage from "@/components/Loading";
import useFetchStates from "@/hooks/useFetchState";
// import withSessionTimeout from "@/components/withSessionTimeout";
function DashboardPatientPage({ params }: { params: any }) {
  const idPatient = parseInt(params.id);
  const { session } = useCustomSession();
  const { user, isLoading } = useFetchUser(session?.user?.token, idPatient);
  const { states, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow mt-36">
        <UserProfileCard paciente={user} provincia={states} />
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default DashboardPatientPage;
