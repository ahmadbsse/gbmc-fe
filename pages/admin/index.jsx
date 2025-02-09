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

const PAGE_SIZE = 1;
const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [parts, setParts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [engineering, setEngineering] = useState([]);
  const [subAssemblies, setSubAssemblies] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalParts, setTotalParts] = useState(0);
  const [totalEngineering, setTotalEngineering] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalSubAssemblies, setTotalSubAssemblies] = useState(0);
  const tabsKey = [
    { name: "Make", key: "suppliers" },
    { name: "Sub Assemblies", key: "sub-assemblies" },
    { name: "Parts", key: "parts" },
    { name: "Engineering Component", key: "engineering" },
  ];
  const [activeTab, setActiveTab] = useState(tabsKey[0]);

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(JSON.parse(storedTab));
    } else {
      setActiveTab(tabsKey[0]);
    }
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getParts = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        url = `/parts?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      } else {
        url = `/parts?populate=*&filters[name][$containsi]=${searchQuery}`;
      }
      await apiClient.GET(url).then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setParts((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
          setTotalParts(res.meta.pagination.total);
          setTotal(res.meta.pagination.total);
        } else {
          setParts([]);
        }
      });
    } catch (error) {
      const message = error.message;

      console.error("Error in POST request:", message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getEngineering = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        url = `/engineering-components?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      } else {
        url = `/engineering-components?populate=*&filters[name][$containsi]=${searchQuery}`;
      }
      await apiClient.GET(url).then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setEngineering((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
          setTotalEngineering(res.meta.pagination.total);
          setTotal(res.meta.pagination.total);
        } else {
          setEngineering([]);
        }
      });
    } catch (error) {
      const message = error.message;
      console.error("Error in POST request:", message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getSubAssemblies = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        url = `/sub-assemblies?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      } else {
        url = `/sub-assemblies?populate=*&filters[name][$containsi]=${searchQuery}`;
      }
      await apiClient.GET(url).then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setSubAssemblies((prev) =>
            isLoadMore ? [...prev, ...transformedData] : transformedData
          );
          setTotalSubAssemblies(res.meta.pagination.total);
          setTotal(res.meta.pagination.total);
        } else {
          setSuppliers([]);
        }
      });
    } catch (error) {
      const message = error.message;
      console.error("Error in POST request:", message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getSuppliers = async (pageNum, isLoadMore) => {
    console.log("Getting suppliers");
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      console.log(pageNum, "pageNum");
      console.log(isLoadMore, "isLoadMore");
      let url = "";
      if (searchQuery == "") {
        url = `/suppliers?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      } else {
        url = `/suppliers?populate=*&filters[name][$containsi]=${searchQuery}`;
      }
      await apiClient.GET(url).then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          console.log(transformedData, "transformedData");
          setSuppliers((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
          setTotalSuppliers(res.meta.pagination.total);
          setTotal(res.meta.pagination.total);
        } else {
          setSuppliers([]);
        }
      });
    } catch (error) {
      const message = error.message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const apiCalls = (page, isLoadMore) => {
    if (activeTab.key == "suppliers") {
      getSuppliers(page, isLoadMore);
    }
    if (activeTab.key == "parts") {
      getParts(page, isLoadMore);
    }
    if (activeTab.key == "sub-assemblies") {
      getSubAssemblies(page, isLoadMore);
    }
    if (activeTab.key == "engineering") {
      getEngineering(page, isLoadMore);
    }
  };

  useEffect(() => {
    setPage(1);
    apiCalls(1, false);
  }, [activeTab]);

  useEffect(() => {
    if (page > 1) apiCalls(page, true);
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      return newPage;
    });
  };

  const setTab = (tab) => {
    //store tab object to local storage
    localStorage.setItem("activeTab", JSON.stringify(tab));
    setActiveTab(tab);
  };

  const tabData = {
    parts: parts?.length,
    engineering: engineering?.length,
    suppliers: suppliers?.length,
    "sub-assemblies": subAssemblies?.length,
  };
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
                onClick={() => setTab(tab)}
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
                        setTab(tab);
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
            <>
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
                total={
                  activeTab.key == "engineering"
                    ? totalEngineering
                    : activeTab.key == "suppliers"
                      ? totalSuppliers
                      : activeTab.key == "sub-assemblies"
                        ? totalSubAssemblies
                        : totalParts
                }
                activeTab={activeTab}
                getData={
                  activeTab.key === "engineering"
                    ? () => getEngineering(1, false)
                    : activeTab.key === "suppliers"
                      ? () => getSuppliers(1, false)
                      : activeTab.key === "sub-assemblies"
                        ? () => getSubAssemblies(1, false)
                        : () => getParts(1, false)
                }
              />

              {tabData[activeTab.key] < total ? (
                <div className="flex justify-center md:justify-end">
                  <p
                    className="w-fit cursor-pointer text-sm underline hover:text-black"
                    onClick={loadMore}
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
