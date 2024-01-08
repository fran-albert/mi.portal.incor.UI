"use client";
import SideBar from "@/components/SideBar";
import HistoryUser from "./history.user";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import LoadingPage from "@/components/Loading";
import HeaderPatient from "@/components/ui/Header";
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
      <div className="flex-grow">
        <HeaderPatient user={user} /> 
        <main className="flex-grow p-4 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-full">
              <p className="text-center">Contenido de la página...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default HistoryPatientPage;
