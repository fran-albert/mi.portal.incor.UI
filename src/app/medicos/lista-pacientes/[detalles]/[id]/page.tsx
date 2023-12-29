"use client";
import SideBar from "@/components/SideBar";
// import withSessionTimeout from "@/components/withSessionTimeout";
function StudiesPatientsPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow"></div>
    </div>
  );
}

// export default withSessionTimeout(Pacientes);
export default StudiesPatientsPage;
