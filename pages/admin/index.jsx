import React, { useEffect, useState } from "react";
import { AdminTabs } from "@/components/admin";
import { Navbar, BaseSearchbar, SeoHead } from "@/components/common";
import ListDashboardData from "@/components/admin/ListDashboardData";
import { BaseLoader } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";

const PAGE_SIZE = 6;
const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [parts, setParts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [engineering, setEngineering] = useState([]);
  const [subAssemblies, setSubAssemblies] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState(null);

  const tabsKey = [
    { name: "Makes", key: "suppliers", tag: "make" },
    { name: "Parts", key: "parts", tag: "part" },
    { name: "Sub Assemblies", key: "sub-assemblies", tag: "sub assembly" },
    { name: "Engineering Components", key: "engineering", tag: "engineering component" },
  ];
  const [activeTab, setActiveTab] = useState(tabsKey[1]);

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(JSON.parse(storedTab));
    } else {
      setActiveTab(tabsKey[0]);
    }
  }, []);

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
          setTotal(res.meta.pagination.total);
          setPagination(res.meta.pagination);
        } else {
          setParts([]);
          setTotal(0);
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
          setTotal(res.meta.pagination.total);
          setPagination(res.meta.pagination);
        } else {
          setEngineering([]);
          setTotal(0);
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
          setTotal(res.meta.pagination.total);
          setPagination(res.meta.pagination);
        } else {
          setSuppliers([]);
          setTotal(0);
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
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        url = `/suppliers?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      } else {
        url = `/suppliers?populate=*&filters[name][$containsi]=${searchQuery}`;
      }
      await apiClient.GET(url).then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          setSuppliers((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
          setTotal(res.meta.pagination.total);
          setPagination(res.meta.pagination);
        } else {
          setSuppliers([]);
          setTotal(0);
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
  }, [activeTab, searchQuery]);

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
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      setActiveTab(tab);
    }
  };

  const tabData = {
    parts: parts?.length,
    engineering: engineering?.length,
    suppliers: suppliers?.length,
    "sub-assemblies": subAssemblies?.length,
  };
  return (
    <>
      <SeoHead title="Admin" />
      <div className="mt-20 min-h-screen bg-gray-50">
        <Navbar isAdmin setTab={setTab} activeTab={activeTab.name} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-3 flex items-center justify-between md:mb-8">
            <h1 className="flex gap-2 text-lg font-bold md:text-3xl">Admin Dashboard</h1>
            <div className="hidden md:flex">
              {tabData[activeTab.key] > 0 || searchQuery !== "" ? (
                <BaseSearchbar setSearchQuery={setSearchQuery} />
              ) : null}
            </div>
          </div>
          <div className="mb-8 ml-auto w-full md:hidden">
            {tabData[activeTab.key] > 0 || searchQuery !== "" ? (
              <BaseSearchbar setSearchQuery={setSearchQuery} />
            ) : null}
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
                total={total}
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
              {pagination?.page < pagination?.pageCount ? (
                <div className="mt-3 flex justify-center md:justify-end">
                  <p
                    className="w-fit cursor-pointer rounded bg-[#000036] px-2.5 py-2 text-sm text-white hover:bg-black hover:text-primary-color"
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
