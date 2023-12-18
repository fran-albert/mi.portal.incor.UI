import SideBar from "@/components/SideBar";
import LoginPage from "./login/page";

function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SideBar />
      <div className="py-12 mt-32">
        <div className="flex flex-wrap justify-center px-4 space-x-0 sm:space-x-8">
          <div className="w-full md:w-1/2 lg:w-1/3 p-2">
            <LoginPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
