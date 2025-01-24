import React, { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { SearchBar } from "@/components/user";
// import ScrollingMarquee from "@/components/common/Marquee";

import { userRoutes } from "@/data";
import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";

const Navbar = ({ isAdmin = false, showSearchbar = false }) => {
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
      <nav className="border-b bg-[#222222] shadow-sm lg:mr-0">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex w-full items-center justify-between gap-8">
              <Link
                href={`${isAdmin ? "/admin" : "/"}`}
                className="text-xl font-extrabold text-white md:text-2xl"
              >
                {appData.name}
                {isAdmin ? " - Admin" : ""}
              </Link>
              {isAdmin ? null : (
                <>
                  <div className="hidden items-center gap-6 text-white md:flex">
                    {userRoutes.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`hover:text-white ${
                          item.routeName.toLowerCase() === router.route.toLowerCase() ||
                          router.route.toLowerCase().includes(item.routeName.toLowerCase())
                            ? "border-b border-primary-color font-medium text-white"
                            : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  {/* Mobile menu */}
                  <>
                    <button onClick={toggleMenu} className="z-50 p-2 md:hidden">
                      {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Sliding menu */}
                    <div
                      className={`fixed left-0 top-0 z-30 h-full w-full transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
                    >
                      <div className="flex h-full flex-col p-6">
                        {/* Menu header */}
                        <div className="mb-8 pt-8">
                          <h2 className="text-2xl font-bold">Menu</h2>
                        </div>

                        {/* Menu items */}
                        <nav className="flex flex-col gap-7">
                          {userRoutes.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              className={`hover:text-white ${
                                item.routeName.toLowerCase() === router.route.toLowerCase() ||
                                router.route.toLowerCase().includes(item.routeName.toLowerCase())
                                  ? "font-medium text-white"
                                  : ""
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </>
                </>
              )}
            </div>
            {router.route != "/" || isAdmin ? (
              <div className="flex items-center gap-4 pl-4">
                {showSearchbar ? <SearchBar /> : null}
                {isAdmin && (
                  <div className="flex items-center gap-4">
                    <LogOut
                      className="h-5 w-5 cursor-pointer hover:text-primary"
                      onClick={handleLogout}
                    />
                    {/* Mobile menu */}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
