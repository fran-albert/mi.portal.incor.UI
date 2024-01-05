"use client";
import SideBar from "@/components/SideBar";
import HistoryUser from "./history.user";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import LoadingPage from "@/components/Loading";
// import withSessionTimeout from "@/components/withSessionTimeout";
function HistoryPatientPage({ params }: { params: any }) {
  const idPatient = parseInt(params.id);
  const { session } = useCustomSession();
  const { user, isLoading } = useFetchUser(session?.user?.token, idPatient);

  if (isLoading) {
    return <LoadingPage props={"Cargando datos del paciente..."} />;
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow mt-40">
        <HistoryUser paciente={user} />
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default HistoryPatientPage;
