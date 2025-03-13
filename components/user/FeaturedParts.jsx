import { BaseImage, BaseLoader } from "@/components/common";
import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import { transformMedia } from "@/utils";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getParts = async () => {
    try {
      setIsLoading(true);
      let url = `/parts?populate=*&filters[active]=true&filters[featured]=true&sort=createdAt:desc`;
      const res = await apiClient.GET(url);
      if (res && res.data.length > 0) {
        const parts = res.data.filter((part) => part.supplier.active);
        const transformedData = transformMedia(parts);
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
          <h2 className="my-4 text-2xl font-bold">Featured Parts</h2>
          <div className="custom-scrollbar flex w-[280px] max-w-7xl flex-col gap-3 overflow-x-auto pb-2 xs:w-[340px] sm:w-[590px] md:w-[600px] lg:w-[990px] lg:flex-row xl:w-[1230px]">
            <Swiper
              modules={[Navigation, Pagination, Mousewheel]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              mousewheel={true}
              direction={"horizontal"}
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="w-full"
            >
              {featuredParts.map((part, index) => (
                <SwiperSlide key={part.id + index + part.documentId}>
                  <Link href={`/tractor-parts/${part.documentId}`}>
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition">
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
                        <div className="absolute right-2 top-2 rounded bg-primary px-1.5 py-0.5 text-xs">
                          {part.supplier.name}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 title={part.name} className="truncate text-center text-lg font-bold">
                          {part.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FeaturedParts;
