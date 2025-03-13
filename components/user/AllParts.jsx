import { BaseImage, BaseLoader, BaseSearchbar } from "@/components/common";
import { useState, useRef, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Link from "next/link";

const PAGE_SIZE = 10;

const AllParts = () => {
  const [page, setPage] = useState(1);
  const [allParts, setAllParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [makes, setMakes] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [pagination, setPagination] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const observerRef = useRef(null);

  const getParts = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (searchQuery == "") {
        if (selectedSupplier) {
          url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&filters[supplier][documentId]=${selectedSupplier}&sort=createdAt:desc`;
        } else {
          url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&sort=createdAt:desc`;
        }
      } else {
        if (selectedSupplier === "") {
          url = `/parts?populate=*&filters[active]=true&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][oem_number][$containsi]=${searchQuery}&sort=createdAt:desc`;
        } else {
          url = `/parts?populate=*&filters[active]=true&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][oem_number][$containsi]=${searchQuery}&filters[supplier][documentId]=${selectedSupplier}&sort=createdAt:desc`;
        }
      }

      const res = await apiClient.GET(url);

      if (res && res.data.length > 0) {
        const parts = res.data.filter((part) => part.supplier.active);
        const transformedData = transformMedia(parts);
        setAllParts((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
        setPagination(res.meta.pagination);
      } else {
        setPagination(null);
        setAllParts([]);
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
  //
  useEffect(() => {
    setPage(1);
    getParts(1, false);
  }, [selectedSupplier]);

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
    getParts(1, false);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (page > 1) getParts(page, true);
  }, [page]);

  const getMakes = async () => {
    try {
      await apiClient.GET(`/suppliers?filters[active]=true`).then(async (res) => {
        if (res && res.data.length > 0) {
          res.data.unshift({ name: "All", documentId: "" });
          setMakes(res.data);
        } else {
          setMakes([]);
        }
      });
    } catch (error) {
      const message = error.message;
      console.error("Error in POST request:", message);
    }
  };
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
    getMakes();
  }, []);
  useEffect(() => {
    if (pagination) {
      setPaginationInfo(Math.min(pagination.page * pagination.pageSize, pagination.total));
    }
  }, [pagination]);

  const getBrand = (id) => {
    const make = makes.find((brand) => brand.documentId === id);
    return make ? make.name : "";
  };

  return (
    <>
      <div className="mt-5 flex flex-col justify-between lg:flex-row lg:items-center lg:gap-3">
        <div className="mb-6 pr-2 sm:ml-auto sm:px-4 md:pr-0">
          <BaseSearchbar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        </div>
      </div>
      <div className="mb-7 flex flex-wrap justify-center text-center text-xl lg:justify-center lg:gap-x-5">
        {makes.map((brand, index) => (
          <span
            onClick={() => setSelectedSupplier(brand.documentId)}
            className={`cursor-pointer break-all px-2 py-2 pb-1 font-bold uppercase hover:text-black md:px-4 md:py-1 ${brand.documentId === selectedSupplier ? "border-b-2 border-b-primary text-black" : ""}`}
            key={index + brand.name}
          >
            {brand.name}
          </span>
        ))}
      </div>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : allParts.length || selectedSupplier ? (
        <>
          {pagination?.total && (
            <p className="my-4 w-fit px-2 text-lg font-bold lg:px-0">{`Showing 1-${paginationInfo} of ${pagination?.total} ${getBrand(selectedSupplier) != "All" ? getBrand(selectedSupplier) : ""} parts`}</p>
          )}
          <div>
            <div className="custom-scrollbar flex max-w-7xl flex-col gap-3 overflow-x-auto pb-2 lg:flex-row">
              <div className="grid w-fit grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:pr-0 xl:grid-cols-4">
                {allParts.map((part, index) => (
                  <Link
                    className=""
                    href={`/tractor-parts/${part.documentId}`}
                    key={part.id + index + part.documentId}
                  >
                    <div className="w-[280px] min-w-[280px] rounded-lg border border-gray-200 bg-white shadow-sm transition xs:w-[330px] sm:w-auto">
                      <div className="relative h-[200px] w-full border-b border-gray-200 p-1">
                        {part.media ? (
                          <BaseImage
                            width={part.media[0].formats?.actual?.width}
                            height={part.media[0].formats?.actual?.height}
                            src={part.media[0].formats?.actual?.url}
                            alt={part.name}
                            priority={true}
                            classes="h-full w-full object-contain rounded-t-lg"
                          />
                        ) : null}
                      </div>
                      <h3
                        title={part.name}
                        className="truncate p-4 text-center text-base font-bold sm:text-lg"
                      >
                        {part.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div ref={observerRef} className="h-10"></div>{" "}
            {/* Observer target for infinite scroll */}
            {isLoadingMore && (
              <p className="mx-auto mt-4 flex w-fit items-center gap-2 text-center text-gray-500">
                <BaseLoader />
                <span>Loading more</span>
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="mt-10 min-h-36 w-fit px-5 text-gray-500">
          {searchQuery ? "No search results found" : "No parts found."}
        </p>
      )}
      {!allParts.length && selectedSupplier ? (
        <p className="min-h-36 w-fit px-5 text-gray-500">
          {searchQuery ? "No search results found" : "No parts found."}
        </p>
      ) : null}
    </>
  );
};

export default AllParts;
