"use client";
import SideBar from "@/components/SideBar";
import EstudiosTable from "./estudiosTable";
// import withSessionTimeout from "@/components/withSessionTimeout";

function EstudiosPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow">
        <EstudiosTable />
      </div>
    </div>
  );
}

// export default withSessionTimeout(EstudiosPage);
export default EstudiosPage;