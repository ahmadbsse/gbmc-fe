import React, { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
// import ScrollingMarquee from "@/components/common/Marquee";

import { userRoutes, tabsKey } from "@/data";
import apiClient from "@/utils/apiClient";

const Navbar = ({ isAdmin = false, setTab, activeTab = "" }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    await fetch("/api/auth/logout").then(() => {
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      apiClient.setAuthToken(null);
      window.location.href = "/admin";
    });
  };
  return (
    <>
      {/* <ScrollingMarquee
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        speed={30}
      /> */}
      <nav className="fixed top-0 z-50 w-full bg-white drop-shadow-xl">
        <div className={`mx-auto px-4 sm:container`}>
          <div className="flex h-[74px] items-center justify-between">
            <div className="flex w-full items-center justify-between gap-8">
              <Link
                onClick={() => {
                  if (isAdmin) setTab({ name: "Parts", key: "parts", tag: "part" });
                }}
                href={`${isAdmin ? "/admin" : "/"}`}
                className="text-xl font-extrabold text-black md:text-2xl"
              >
                <Image
                  height={70}
                  width={150}
                  src="/assets/logo.svg"
                  alt="logo"
                  priority
                  className="h-[70px] w-[150px]"
                />
              </Link>
              {isAdmin ? (
                <div className="flex items-center gap-4 pl-4">
                  {isAdmin && (
                    <div className="flex items-center gap-4">
                      <LogOut
                        className="h-5 w-5 cursor-pointer hover:text-primary"
                        onClick={handleLogout}
                      />
                      <>
                        <button onClick={toggleMenu} className="z-50 p-2 md:hidden">
                          {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Sliding menu */}
                        <div
                          className={`fixed left-0 top-0 z-40 h-screen w-screen transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
                            isOpen ? "translate-x-0" : "-translate-x-full"
                          }`}
                        >
                          <div className="flex h-full flex-col p-6">
                            {/* Menu header */}
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold">Menu</h2>
                            </div>

                            {/* Menu items */}

                            <nav className="flex flex-col gap-7 text-base">
                              {tabsKey.map((tab) => (
                                <div
                                  key={tab.key}
                                  onClick={() => {
                                    setTab(tab);
                                    setIsOpen(false);
                                  }}
                                >
                                  <div
                                    className={`w-fit hover:text-solidGray ${
                                      activeTab == tab.name
                                        ? "border-b-2 border-primary-color font-medium text-black"
                                        : ""
                                    }`}
                                  >
                                    {tab.name}
                                  </div>
                                </div>
                              ))}
                            </nav>
                          </div>
                        </div>
                      </>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="hidden items-center justify-between gap-6 text-black sm:flex">
                    {userRoutes.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`hover:text-solidGray ${
                          item.routeName.toLowerCase() === router.route.toLowerCase() ||
                          router.route.toLowerCase().includes(item.routeName.toLowerCase())
                            ? "border-b-2 border-primary-color font-medium text-black"
                            : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  {/* Mobile menu */}
                  <>
                    <button onClick={toggleMenu} className="z-50 p-2 sm:hidden">
                      {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Sliding menu */}
                    <div
                      className={`fixed left-0 top-0 z-40 h-screen w-screen transform bg-white shadow-lg transition-transform duration-300 ease-in-out sm:hidden ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
                    >
                      <div className="flex h-full flex-col p-6">
                        {/* Menu header */}
                        <div className="mb-8">
                          <h2 className="text-2xl font-bold">Menu</h2>
                        </div>

                        {/* Menu items */}
                        <nav className="flex flex-col gap-7">
                          {isAdmin
                            ? tabsKey.map((tab) => (
                                <div key={tab.key} onClick={() => setTab(tab)}>
                                  {tab.name}
                                </div>
                              ))
                            : userRoutes.map((item, index) => (
                                <Link
                                  key={index}
                                  href={item.href}
                                  className={`hover:text-solidGray`}
                                >
                                  <div
                                    className={`w-fit ${
                                      item.routeName.toLowerCase() === router.route.toLowerCase() ||
                                      router.route
                                        .toLowerCase()
                                        .includes(item.routeName.toLowerCase())
                                        ? "border-b-2 border-primary-color font-medium text-black"
                                        : ""
                                    }`}
                                  >
                                    {item.name}
                                  </div>
                                </Link>
                              ))}
                        </nav>
                      </div>
                    </div>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
