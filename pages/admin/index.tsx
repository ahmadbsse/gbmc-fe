import React, { useEffect, useState } from "react";
import Head from "next/head";

import { AdminTabs } from "@/components/admin";
import { Navbar } from "@/components/common";
import ListDashboardData from "@/components/admin/ListDashboardData";
import { BaseLoader } from "@/components/common";

import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";

import type { Categories } from "@/types";

type tab = {
  name: string;
  key: string;
};
const AdminDashboard = () => {
  const tabsKey = [
    { name: "Categories", key: "categories" },
    { name: "Suppliers", key: "suppliers" },
    { name: "Sub Assemblies", key: "sub-assemblies" },
    { name: "Parts", key: "parts" },
    { name: "Engineering", key: "engineering" },
  ];
  const [activeTab, setActiveTab] = useState<tab>(tabsKey[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Categories>(null);
  const [parts, setParts] = useState(null);
  const [engineering, setEngineering] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const [subAssemblies, setSubAssemblies] = useState(null);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/categories?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setCategories(transformedData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setCategories(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    }
  };
  const getParts = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/parts?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setParts(transformedData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setParts(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    }
  };
  const getEngineering = async () => {
    setEngineering(null);
  };
  const getSubAssemblies = async () => {
    setSubAssemblies(null);
  };
  const getSuppliers = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/suppliers?populate=*").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setSuppliers(transformedData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setSuppliers(null);
        }
      });
    } catch (error) {
      const message = (error as Error).message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (activeTab.key == "categories") {
      getCategories();
    }
    if (activeTab.key == "suppliers") {
      getSuppliers();
    }
    if (activeTab.key == "parts") {
      getParts();
    }
    if (activeTab.key == "sub-assemblies") {
      getSubAssemblies();
    }
  }, [activeTab]);

  return (
    <>
      <Head>
        <title>{`${appData.name} - Admin`}</title>
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
          <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

          <div className="mb-6 flex gap-4">
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

          {isLoading ? (
            <div className="mx-auto mt-10 w-fit">
              <BaseLoader width={40} height={40} />
            </div>
          ) : (
            <ListDashboardData
              data={
                activeTab.key == "categories"
                  ? categories
                  : activeTab.key == "engineering"
                    ? engineering
                    : activeTab.key == "suppliers"
                      ? suppliers
                      : activeTab.key == "sub-assemblies"
                        ? subAssemblies
                        : parts
              }
              activeTab={activeTab}
              getData={
                activeTab.key == "categories"
                  ? getCategories
                  : activeTab.key == "engineering"
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
