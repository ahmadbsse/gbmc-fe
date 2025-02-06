import React, { useEffect, useState } from "react";
import Head from "next/head";

import { AdminTabs } from "@/components/admin";
import { Navbar } from "@/components/common";
import ListDashboardData from "@/components/admin/ListDashboardData";
import { BaseLoader } from "@/components/common";

import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";

import { Menu, X } from "lucide-react";

type tab = {
  name: string;
  key: string;
};
const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const tabsKey = [
    { name: "Suppliers", key: "suppliers" },
    { name: "Sub Assemblies", key: "sub-assemblies" },
    { name: "Parts", key: "parts" },
    { name: "Engineering", key: "engineering" },
  ];
  const [activeTab, setActiveTab] = useState<tab>(tabsKey[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [parts, setParts] = useState(null);
  const [engineering, setEngineering] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const [subAssemblies, setSubAssemblies] = useState(null);

  const getParts = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/parts?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setParts(transformedData);
        } else {
          setParts(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      console.error("Error in POST request:", message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEngineering = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/engineering-components?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setEngineering(transformedData);
        } else {
          setEngineering(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;
      console.error("Error in POST request:", message);
    } finally {
      setIsLoading(false);
    }
  };
  const getSubAssemblies = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/sub-assemblies?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setSubAssemblies(transformedData);
        } else {
          setSuppliers(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      console.error("Error in POST request:", message);
    } finally {
      setIsLoading(false);
    }
  };
  const getSuppliers = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/suppliers?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setSuppliers(transformedData);
        } else {
          setSuppliers(null);
        }
        setIsLoading(false);
      });
    } catch (error) {
      const message = (error as Error).message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab.key == "suppliers") {
      getSuppliers();
    }
    if (activeTab.key == "parts") {
      getParts();
    }
    if (activeTab.key == "sub-assemblies") {
      getSubAssemblies();
    }
    if (activeTab.key == "engineering") {
      getEngineering();
    }
  }, [activeTab]);

  return (
    <>
      <Head>
        <title>Admin | {appData.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button onClick={toggleMenu} className="z-50 ml-auto w-fit p-2 md:hidden">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {/* Desktop */}
          <div className="mb-6 hidden gap-4 md:flex">
            {tabsKey.map((tab) => (
              <AdminTabs
                key={tab.key}
                active={activeTab.name === tab.name}
                onClick={() => setActiveTab(tab)}
              >
                {tab.name}
              </AdminTabs>
            ))}
          </div>

          {/* Mobile */}
          <>
            {/* Sliding menu */}
            <div
              className={`ease-inmb-8-out fixed bottom-0 left-0 z-30 h-fit w-[100vw] transform bg-white shadow-lg transition-transform duration-300 ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex flex-col p-6">
                {/* Menu items */}
                <nav className="flex flex-col gap-5">
                  {tabsKey.map((tab) => (
                    <AdminTabs
                      key={tab.key}
                      active={activeTab.name === tab.name}
                      onClick={() => {
                        if (isOpen) setIsOpen(!isOpen);
                        setActiveTab(tab);
                      }}
                    >
                      {tab.name}
                    </AdminTabs>
                  ))}
                </nav>
              </div>
            </div>
          </>
          {isLoading ? (
            <div className="mx-auto mt-10 w-fit">
              <BaseLoader width={40} height={40} />
            </div>
          ) : (
            <ListDashboardData
              data={
                activeTab.key == "engineering"
                  ? engineering
                  : activeTab.key == "suppliers"
                    ? suppliers
                    : activeTab.key == "sub-assemblies"
                      ? subAssemblies
                      : parts
              }
              activeTab={activeTab}
              getData={
                activeTab.key == "engineering"
                  ? getEngineering
                  : activeTab.key == "suppliers"
                    ? getSuppliers
                    : activeTab.key == "sub-assemblies"
                      ? getSubAssemblies
                      : getParts
              }
            />
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
