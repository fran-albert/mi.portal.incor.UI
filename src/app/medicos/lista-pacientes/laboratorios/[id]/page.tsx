"use client";
import SideBar from "@/components/SideBar";
import LabsTable from "./labs.table";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useFetchUser from "@/hooks/useFetchUser";
import LoadingPage from "@/components/Loading";
import DataLabsTable from "./data.labs.table";
// import withSessionTimeout from "@/components/withSessionTimeout";
function LabsPatientPage({ params }: { params: any }) {
  const idPatient = parseInt(params.id);
  const { session } = useCustomSession();
  const { user, isLoading } = useFetchUser(session?.user?.token, idPatient);

  if (isLoading) {
    return <LoadingPage props={"Cargando datos del paciente..."} />;
  }

  return (
    <div className="flex flex-col md:flex-row ">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow mt-32 ">
        <main className="flex-grow p-4 flex justify-center">
          <div className="w-full flex flex-col items-center">
            <div className="w-full mb-4">
              <LabsTable paciente={user} />
            </div>
            <div className="w-full">
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
