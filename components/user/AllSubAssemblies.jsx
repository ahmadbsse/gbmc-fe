import { BaseImage, BaseLoader, BaseSearchbar } from "@/components/common";
import { useState, useRef, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Link from "next/link";

const PAGE_SIZE = 10;

const AllSubAssemblies = () => {
  const [page, setPage] = useState(1);
  const [AllSubAssemblies, setAllSubAssemblies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const observerRef = useRef(null);

  const getSubAssemblies = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        url = `/sub-assemblies?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
      } else {
        url = `/sub-assemblies?populate=*&filters[active]=true&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][oem_number][$containsi]=${searchQuery}&sort=createdAt:desc`;
      }

      const res = await apiClient.GET(url);

      if (res && res.data.length > 0) {
        const transformedData = transformMedia(res.data);
        setAllSubAssemblies((prev) =>
          isLoadMore ? [...prev, ...transformedData] : transformedData
        );
        setPagination(res.meta.pagination);
      } else {
        setPagination(null);
        setAllSubAssemblies([]);
      }
    } catch (error) {
      console.error("Error in GET request:", error.message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
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
    setPage(1);
    getSubAssemblies(1, false);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (page > 1) getSubAssemblies(page, true);
  }, [page]);

  // Infinite Scroll Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.page < pagination?.pageCount) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [pagination]);

  useEffect(() => {
    if (pagination) {
      setPaginationInfo(Math.min(pagination.page * pagination.pageSize, pagination.total));
    }
  }, [pagination]);

  return (
    <>
      <div className="mt-5 flex flex-col justify-between lg:flex-row lg:items-center lg:gap-3">
        <div className="mb-6 pr-2 sm:ml-auto sm:px-4 md:pr-0">
          <BaseSearchbar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        </div>
      </div>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : AllSubAssemblies.length ? (
        <>
          {pagination?.total && (
            <p className="mb-6 mt-3 w-fit px-2 text-base font-bold sm:text-[19px] lg:px-0">{`Showing 1-${paginationInfo} of ${pagination?.total} Sub Assemblies`}</p>
          )}
          <div>
            <div className="custom-scrollbar flex max-w-7xl flex-col gap-3 overflow-x-auto pb-2 lg:flex-row">
              <div className="grid w-fit grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:pr-0 xl:grid-cols-4">
                {AllSubAssemblies.map((subAssembly, index) => (
                  <Link
                    className=""
                    href={`/sub-assemblies/${subAssembly.documentId}`}
                    key={subAssembly.id + index + subAssembly.documentId}
                  >
                    <div className="w-[280px] min-w-[280px] rounded-lg border border-gray-200 bg-white shadow-sm transition xs:w-[330px] sm:w-auto">
                      <div className="relative h-[200px] w-full border-b border-gray-200">
                        {subAssembly.media ? (
                          <BaseImage
                            width={
                              subAssembly.media[subAssembly?.media?.length - 1].formats?.actual
                                ?.width
                            }
                            height={
                              subAssembly.media[subAssembly?.media?.length - 1].formats?.actual
                                ?.height
                            }
                            src={
                              subAssembly.media[subAssembly?.media?.length - 1].formats?.actual?.url
                            }
                            alt={subAssembly.name}
                            priority={true}
                            classes="h-full w-full object-contain rounded-t-lg"
                          />
                        ) : null}
                      </div>
                      <h3
                        title={subAssembly.name}
                        className="truncate p-4 text-center text-base font-semibold sm:text-lg"
                      >
                        {subAssembly.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div ref={observerRef} className="h-10"></div>{" "}
            {/* Observer target for infinite scroll */}
            {isLoadingMore && <p className="mt-4 text-center text-gray-500">Loading more...</p>}
          </div>
        </>
      ) : (
        <p className="mt-10 min-h-36 w-fit px-5 text-gray-500">
          {searchQuery ? "No search results found" : "No sub assemblies found."}
        </p>
      )}
    </>
  );
};

export default AllSubAssemblies;
