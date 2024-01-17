"use client";
import SideBar from "@/components/SideBar";
import StudiesTable from "./studies.table";
import withSessionTimeout from "@/components/WithSessionTimeout";

function EstudiosPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow">
        <StudiesTable />
      </div>
    </div>
  );
}

export default withSessionTimeout(EstudiosPage);
