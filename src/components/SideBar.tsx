"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaFileMedicalAlt,
  FaUser,
  FaUsers,
  FaUserLock,
  FaHome,
} from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function SideBar() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const { data: session } = useSession();

  // const esPaciente = session?.user.roles.includes("Paciente");
  // const esMedico = session?.user.roles.includes("Médico");
  // const esAdmin = session?.user.roles.includes("Administrador");
  // const esSecretaria = session?.user.roles.includes("Secretaria");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 py-4">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              >
                <span className="sr-only">Abrir sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a
                href="https://incorcentromedico.com.ar/"
                className="flex ml-2 md:mr-24"
              >
                <Image
                  src="https://incorcentromedico.com.ar/wp-content/uploads/2018/07/incor-logo.png"
                  className="h-20 w-auto mr-3"
                  width={200}
                  height={100}
                  alt="Incor Logo"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-20 left-0 z-40 sm:w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 sm:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group cursor-pointer"
                onClick={() => router.push("/home")}
              >
                <FaHome size={25} color="#0f766e" />
                <span className="flex-1 ml-3 whitespace-nowrap">Inicio</span>
              </a>
            </li>
            <li>
              <a
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <FaUser size={25} color="#0f766e" />
                <span className="flex-1 ml-3 whitespace-nowrap">Perfil</span>
              </a>
            </li>

            {/* {esPaciente && ( */}
              <>
                <li>
                  <a
                    onClick={() => router.push("/estudios")}
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group cursor-pointer"
                  >
                    <FaFileMedicalAlt size={25} color="#0f766e" />
                    <span className="ml-3">Estudios</span>
                  </a>
                </li>
              </>
            {/* )} */}

            {/* {esSecretaria && ( */}
              <>
                <li>
                  <a
                    onClick={() => router.push("/secretaria")}
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group cursor-pointer"
                  >
                    <FaFileMedicalAlt size={25} color="#0f766e" />
                    <span className="ml-3">Panel Secretaria</span>
                  </a>
                </li>
              </>
            {/* )} */}

            {/* {esMedico && ( */}
              <>
                <li>
                  <button
                    type="button"
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                    aria-controls="dropdown-example"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    data-collapse-toggle="dropdown-example"
                  >
                    <FaUsers size={25} color="#0f766e" />
                    <span className="flex-1 ml-3 text-left whitespace-nowrap">
                      Mis Pacientes
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id="dropdown-example"
                    className={`${
                      isDropdownOpen ? "block" : "hidden"
                    } py-2 space-y-2`}
                  >
                    <li>
                      <a
                        onClick={() => router.push("/pacientes")}
                        className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer"
                      >
                        <FaUsers size={25} color="#0f766e" />
                        <span className="ml-3">Lista de Pacientes</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            {/* )} */}
            {/* {esAdmin && ( */}
              <li>
                <a
                  onClick={() => router.push("/ajustes")}
                  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group cursor-pointer"
                >
                  <FaUserLock size={25} color="#0f766e" />
                  <span className="ml-3">Panel Admin</span>
                </a>
              </li>
            {/* )} */}

            <hr />
            <li>
              <a
                onClick={() =>
                  signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })
                }
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-red-100  group cursor-pointer"
              >
                <FiLogOut size={25} />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Cerrar Sesión
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
