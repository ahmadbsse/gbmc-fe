import { Star } from "lucide-react";
import { BaseButton, BaseImage, BaseLoader } from "@/components/common";
import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Link from "next/link";

const PAGE_SIZE = 8;
const AllParts = ({ selectedSupplier }) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [allParts, setAllParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getParts = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      let url = "";
      if (selectedSupplier) {
        url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}&filters[supplier][documentId]=${selectedSupplier}`;
      } else {
        url = `/parts?populate=*&filters[active]=true&pagination[page]=${pageNum}&pagination[pageSize]=${PAGE_SIZE}`;
      }
      const res = await apiClient.GET(url);

      if (res && res.data.length > 0) {
        const transformedData = transformMedia(res.data);
        setAllParts((prev) => [...prev, ...transformedData]);

        setTotal(res.meta.pagination.total);
      }
    } catch (error) {
      console.error("Error in POST request:", error.message);
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
  }, []);
  useEffect(() => {
    if (selectedSupplier) {
      setAllParts([]);
      setPage(1);
      getParts(1);
    }
  }, [selectedSupplier]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
    getParts(page + 1, true);
  };

  return (
    <>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : allParts?.length ? (
        <div>
          <h2 className="my-4 text-lg font-bold md:text-3xl">All Parts</h2>
          <div className="custom-scrollbar flex max-w-7xl flex-col gap-3 overflow-x-auto pb-2 lg:flex-row">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {allParts.map((part, index) => (
                <Link href={`/tractor-parts/${part.documentId}`} key={part.id + index}>
                  <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition">
                    <div className="relative h-[200px] w-full border-b border-gray-200">
                      <BaseImage
                        width={part.media[0].formats?.actual?.width}
                        height={part.media[0].formats?.actual?.height}
                        src={part.media[0].formats?.actual?.url}
                        alt={part.name}
                        priority={true}
                        classes="h-full w-full object-cover rounded-t-lg"
                      />
                      {part.featured ? (
                        <div className="absolute right-2 top-2 rounded-full bg-solidGray/40 p-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                        </div>
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
      ) : null}
    </>
  );
};

export default AllParts;
