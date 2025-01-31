import { BaseButton, BaseImage, BaseLoader } from "@/components/common";
import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Link from "next/link";

const FeaturedParts = () => {
  const [total, setTotal] = useState(0);
  const [featuredParts, setFeaturedParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getParts = async () => {
    try {
      setIsLoading(true);
      let url = `/parts?populate=*&filters[active]=true&filters[featured]=true`;
      const res = await apiClient.GET(url);
      if (res && res.data.length > 0) {
        const transformedData = transformMedia(res.data);
        setFeaturedParts(transformedData);
      }
    } catch (error) {
      console.error("Error in POST request:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getParts();
  }, []);

  return (
    <>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : featuredParts?.length ? (
        <div>
          <h2 className="my-4 text-lg font-bold md:text-3xl">Featured Parts</h2>
          <div className="custom-scrollbar flex max-w-7xl flex-col gap-3 overflow-x-auto pb-2 lg:flex-row">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredParts.map((part, index) => (
                <Link href={`/tractor-parts/${part.documentId}`} key={part.id + index}>
                  <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition">
                    <div className="relative h-[200px] w-full">
                      <BaseImage
                        width={part.media[0].formats?.actual?.width}
                        height={part.media[0].formats?.actual?.height}
                        src={part.media[0].formats?.actual?.url}
                        alt={part.name}
                        priority={true}
                        classes="h-full w-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{part.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FeaturedParts;
