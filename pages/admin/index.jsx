import React, { useEffect, useState } from "react";
import { AdminTabs } from "@/components/admin";
import { Navbar, BaseSearchbar, SeoHead } from "@/components/common";
import ListDashboardData from "@/components/admin/ListDashboardData";
import { BaseLoader } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { tabsKey } from "@/data";
import MarqueeDetails from "@/components/admin/MarqueeDetails";

const PAGE_SIZE = 10;
const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [parts, setParts] = useState([]);
  const [makes, setMakes] = useState([]);
  const [engineering, setEngineering] = useState([]);
  const [subAssemblies, setSubAssemblies] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [hasMarquee, setHasMarquee] = useState(false);

  const [activeTab, setActiveTab] = useState();

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(JSON.parse(storedTab));
      setPagination(null);
    } else {
      setActiveTab(tabsKey[0]);
    }
  }, []);

  const getParts = async (pageNum, isLoadMore = false) => {
    if (activeTab?.key == "parts") {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        let url = "";
        if (searchQuery == "") {
          url = `/parts?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
        } else {
          url = `/parts?populate=*&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][oem_number][$containsi]=${searchQuery}&sort=createdAt:desc`;
        }
        await apiClient.GET(url).then(async (res) => {
          setPagination(null);
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
            setParts((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
            setTotal(res.meta.pagination.total);
            setPagination(res.meta.pagination);
          } else {
            setPagination(null);
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
    }
  };

  const getEngineering = async (pageNum, isLoadMore = false) => {
    if (activeTab?.key == "engineering") {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        let url = "";
        if (searchQuery == "") {
          url = `/engineering-components?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
        } else {
          url = `/engineering-components?populate=*&filters[name][$containsi]=${searchQuery}&sort=createdAt:desc`;
        }
        await apiClient.GET(url).then(async (res) => {
          setPagination(null);
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
            setEngineering((prev) =>
              isLoadMore ? [...prev, ...transformedData] : transformedData
            );
            setTotal(res.meta.pagination.total);
            setPagination(res.meta.pagination);
          } else {
            setPagination(null);
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
    }
  };

  const getSubAssemblies = async (pageNum, isLoadMore = false) => {
    if (activeTab?.key == "sub-assemblies") {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        let url = "";
        if (searchQuery == "") {
          url = `/sub-assemblies?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
        } else {
          url = `/sub-assemblies?populate=*&filters[name][$containsi]=${searchQuery}&sort=createdAt:desc`;
        }
        await apiClient.GET(url).then(async (res) => {
          setPagination(null);
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
            setSubAssemblies((prev) =>
              isLoadMore ? [...prev, ...transformedData] : transformedData
            );
            setTotal(res.meta.pagination.total);
            setPagination(res.meta.pagination);
          } else {
            setPagination(null);
            setSubAssemblies([]);
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
    }
  };

  const getMakes = async (pageNum, isLoadMore) => {
    if (activeTab?.key == "suppliers") {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        let url = "";
        if (searchQuery == "") {
          url = `/suppliers?populate=*&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
        } else {
          url = `/suppliers?populate=*&filters[name][$containsi]=${searchQuery}&sort=createdAt:desc`;
        }
        await apiClient.GET(url).then(async (res) => {
          setPagination(null);
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
            setMakes((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
            setTotal(res.meta.pagination.total);
            setPagination(res.meta.pagination);
          } else {
            setPagination(null);
            setMakes([]);
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
    }
  };

  const apiCalls = (page, isLoadMore) => {
    if (activeTab?.key == "suppliers") {
      getMakes(page, isLoadMore);
    }
    if (activeTab?.key == "parts") {
      getParts(page, isLoadMore);
    }
    if (activeTab?.key == "sub-assemblies") {
      getSubAssemblies(page, isLoadMore);
    }
    if (activeTab?.key == "engineering") {
      getEngineering(page, isLoadMore);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Adjust debounce delay (500ms) as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      setPagination(null);
      apiCalls(page, true);
    }
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      return newPage;
    });
  };
  useEffect(() => {
    setPagination(null);
    setPage(1);
    setTotal(0);
    apiCalls(1, false);
  }, [activeTab, debouncedSearchQuery]);

  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      setDebouncedSearchQuery("");
      setSearchQuery("");
      localStorage.setItem("activeTab", JSON.stringify(tab));
      setActiveTab(tab);
    }
  };

  const tabData = {
    parts: parts?.length,
    engineering: engineering?.length,
    suppliers: makes?.length,
    "sub-assemblies": subAssemblies?.length,
  };
  useEffect(() => {
    const hasMarquee = localStorage.getItem("hasMarquee");
    if (hasMarquee) {
      setHasMarquee(JSON.parse(hasMarquee));
    }
  }, []);
  return (
    <>
      <SeoHead title="Admin" />
      <Navbar isAdmin setTab={setTab} activeTab={activeTab?.name} showMarquee={false} />
      <div className={`min-h-screen bg-[#f3f3f3] ${hasMarquee ? "mt-28" : "mt-20"}`}>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-3 flex items-center justify-between md:mb-8">
            <h1 className="flex gap-2 text-2xl font-bold md:text-[1.65rem]">Admin Dashboard</h1>
            <div className="hidden md:flex">
              {tabData[activeTab?.key] > 0 || searchQuery !== "" ? (
                <BaseSearchbar
                  key={activeTab?.key}
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                />
              ) : null}
            </div>
          </div>
          <div className="mb-8 ml-auto w-full md:hidden">
            {tabData[activeTab?.key] > 0 || searchQuery !== "" ? (
              <BaseSearchbar
                key={activeTab?.key}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
              />
            ) : null}
          </div>
          {/* Desktop */}
          <div className="mb-6 hidden gap-4 md:flex">
            {tabsKey.map((tab) => (
              <AdminTabs
                key={tab?.key}
                active={activeTab?.name === tab?.name}
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
          ) : activeTab?.key == "marquee" ? (
            <MarqueeDetails />
          ) : (
            <>
              <ListDashboardData
                pagination={pagination}
                data={
                  activeTab?.key == "engineering"
                    ? engineering
                    : activeTab?.key == "suppliers"
                      ? makes
                      : activeTab?.key == "sub-assemblies"
                        ? subAssemblies
                        : parts
                }
                total={total}
                activeTab={activeTab}
                setData={
                  activeTab?.key == "engineering"
                    ? setEngineering
                    : activeTab?.key == "suppliers"
                      ? setMakes
                      : activeTab?.key == "sub-assemblies"
                        ? setSubAssemblies
                        : setParts
                }
                getData={
                  activeTab?.key === "engineering"
                    ? () => getEngineering(1, false)
                    : activeTab?.key === "suppliers"
                      ? () => getMakes(1, false)
                      : activeTab?.key === "sub-assemblies"
                        ? () => getSubAssemblies(1, false)
                        : () => getParts(1, false)
                }
              />
              {pagination?.page < pagination?.pageCount ? (
                <div className="mt-3 flex justify-center md:justify-end">
                  <button
                    className="w-fit cursor-pointer rounded bg-[#000036] px-2.5 py-2 text-sm font-bold text-white hover:bg-black hover:text-primary-color"
                    onClick={loadMore}
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </button>
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
