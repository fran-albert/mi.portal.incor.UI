"use client"
import PatientsTable from "./patient.table";
import SideBar from "@/components/SideBar";
// import withSessionTimeout from "@/components/withSessionTimeout";
function PatientDashboardPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow">
        <PatientsTable />
      </div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default PatientDashboardPage;
