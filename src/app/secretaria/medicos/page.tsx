"use client";
import SideBar from "@/components/SideBar";
import DoctorsTable from "./doctors.table";
// import withSessionTimeout from "@/components/withSessionTimeout";
const SecretariaPage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 w-full">
        <SideBar />
      </div>
      <div className="flex-grow">
        <DoctorsTable />
      </div>
    </div>
  );
};

// export default withSessionTimeout(SecretariaPage);
export default SecretariaPage;
