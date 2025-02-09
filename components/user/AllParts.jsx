import { BaseImage, BaseLoader, BaseSearchbar } from "@/components/common";
import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Link from "next/link";

const PAGE_SIZE = 8;

const AllParts = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [allParts, setAllParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

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
          url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&filters[supplier][documentId]=${selectedSupplier}`;
        } else {
          url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
        }
      } else {
        url = `/parts?populate=*&filters[active]=true&filters[name][$containsi]=${searchQuery}`;
      }

      const res = await apiClient.GET(url);

      if (res && res.data.length > 0) {
        const parts = res.data.filter((part) => part.supplier.active);
        const transformedData = transformMedia(parts);
        setAllParts((prev) => (isLoadMore ? [...prev, ...transformedData] : transformedData));
        setTotal(res.meta.pagination.total);
      } else {
        setAllParts([]); // Ensure the list clears when no results match
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
    getParts(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    getParts(1);
  }, [searchQuery, selectedSupplier]);

  const loadMore = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      getParts(newPage, true);
      return newPage;
    });
  };
  const getSuppliers = async () => {
    try {
      await apiClient.GET(`/suppliers?filters[active]=true`).then(async (res) => {
        if (res && res.data.length > 0) {
          setSuppliers(res.data);
        } else {
          setSuppliers([]);
        }
      });
    } catch (error) {
      const message = error.message;
      console.error("Error in POST request:", message);
    }
  };
  useEffect(() => {
    getSuppliers();
  }, []);
  return (
    <>
      <div className="mt-5 flex flex-col items-center justify-between gap-3 lg:flex-row">
        <h2 className="my-4 text-lg font-bold md:text-3xl">All Parts</h2>
        {allParts.length > 0 ? <BaseSearchbar setSearchQuery={setSearchQuery} /> : null}
      </div>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : allParts.length ? (
        <>
          <div className="mb-3 flex flex-wrap justify-start text-xs lg:justify-center lg:gap-5 lg:text-base">
            {suppliers.map((brand, index) => (
              <span
                onClick={() => setSelectedSupplier(brand.documentId)}
                className={`cursor-pointer p-2 font-medium uppercase hover:text-black md:p-4`}
                key={index + brand.name}
              >
                {brand.name}
              </span>
            ))}
          </div>
          <div>
            <div className="custom-scrollbar flex max-w-7xl flex-col gap-3 overflow-x-auto pb-2 lg:flex-row">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {allParts.map((part, index) => (
                  <Link
                    href={`/tractor-parts/${part.documentId}`}
                    key={part.id + index + part.documentId}
                  >
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition">
                      <div className="relative h-[200px] w-full border-b border-gray-200">
                        {part.media ? (
                          <BaseImage
                            width={part.media[0].formats?.actual?.width}
                            height={part.media[0].formats?.actual?.height}
                            src={part.media[0].formats?.actual?.url}
                            alt={part.name}
                            priority={true}
                            classes="h-full w-full object-cover rounded-t-lg"
                          />
                        ) : null}
                      </div>
                      <h3 className="p-4 text-lg font-semibold">{part.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {allParts.length < total && (
              <div className="flex justify-center md:justify-end">
                <p
                  className="w-fit cursor-pointer text-sm underline hover:text-black"
                  onClick={loadMore}
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="mt-10 text-center text-gray-500">No parts found.</p>
      )}
    </>
  );
};

export default AllParts;
