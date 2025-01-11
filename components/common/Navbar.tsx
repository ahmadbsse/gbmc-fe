import React from "react";
import { Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { SearchBar } from "@/components/user";
import ScrollingMarquee from "@/components/common/Marquee";

import { adminRoutes, userRoutes } from "@/data";
import { appData } from "@/constants";

const Navbar = ({ isAdmin = false, showSearchbar = false }) => {
  const router = useRouter();
  return (
    <>
      <ScrollingMarquee
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        speed={30}
      />
      <nav className="mr-2 border-b bg-white shadow-sm lg:mr-0">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex w-full items-center justify-between gap-8">
              <Link href="/" className="text-xl font-extrabold text-primary md:text-2xl">
                {appData.name}
              </Link>
              {isAdmin ? (
                <div className="hidden items-center gap-6 md:flex">
                  {adminRoutes.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`hover:text-black ${
                        item.routeName.toLowerCase() === router.route.toLowerCase() ||
                        router.route.toLowerCase().includes(item.routeName.toLowerCase())
                          ? "border-b font-semibold text-black"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="hidden items-center gap-6 md:flex">
                  {userRoutes.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`hover:text-black ${
                        item.routeName.toLowerCase() === router.route.toLowerCase() ||
                        router.route.toLowerCase().includes(item.routeName.toLowerCase())
                          ? "border-b border-primary-color font-medium text-black"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {router.route != "/" || isAdmin ? (
              <div className="flex items-center gap-4 pl-4">
                {showSearchbar ? <SearchBar /> : null}
                {isAdmin && (
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 cursor-pointer hover:text-primary" />
                    <User className="h-5 w-5 cursor-pointer hover:text-primary" />
                    <LogOut className="h-5 w-5 cursor-pointer hover:text-primary" />
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
