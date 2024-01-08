"use client";
import SideBar from "@/components/SideBar";
import LabsTable from "./labs.table";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import LoadingPage from "@/components/Loading";
import DataLabsTable from "./data.labs.table";
import HeaderPatient from "@/components/ui/Header";
// import withSessionTimeout from "@/components/withSessionTimeout";
function LabsPatientPage({ params }: { params: any }) {
  const idPatient = parseInt(params.id);
  const { session } = useCustomSession();
  const { user, isLoading } = useFetchUser(session?.user?.token, idPatient);

  if (isLoading) {
    return <LoadingPage props={"Cargando datos del paciente..."} />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-48 w-full">
        <SideBar />
      </div>
      <div className="flex-grow">
        <HeaderPatient user={user} />
        <main className="p-4 flex justify-center">
          <div className="flex flex-col items-center w-full">
            <div className="w-auto lg:w-4/5">
              <LabsTable paciente={user} />
            </div>
            <div className="w-auto lg:w-4/5">
              {/* <DataLabsTable paciente={user} /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default LabsPatientPage;
