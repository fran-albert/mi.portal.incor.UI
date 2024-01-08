"use client";
import SideBar from "@/components/SideBar";
import PatientStudies from "./patient.studies";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import useFetchStates from "@/hooks/useFetchState";
import LoadingPage from "@/components/Loading";
import HeaderPatient from "@/components/ui/Header";
// import withSessionTimeout from "@/components/withSessionTimeout";
function PatientStudiesPage({ params }: { params: any }) {
  const idPatient = parseInt(params.id);
  const { session } = useCustomSession();
  const { user, isLoading } = useFetchUser(session?.user?.token, idPatient);
  const { states, isLoading: isLoadingStates } = useFetchStates(
    session?.user?.token
  );

  if (isLoading || isLoadingStates) {
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
              <PatientStudies paciente={user} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default PatientStudiesPage;
