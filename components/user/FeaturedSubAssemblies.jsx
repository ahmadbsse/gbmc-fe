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

const FeaturedSubAssemblies = () => {
  const [featuredSubAssemblies, setFeaturedSubAssemblies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubAssemblies = async () => {
    try {
      setIsLoading(true);
      let url = `/sub-assemblies?populate=*&filters[active]=true&filters[featured]=true&sort=createdAt:desc`;
      const res = await apiClient.GET(url);
      if (res && res.data.length > 0) {
        const transformedData = transformMedia(res.data);
        setFeaturedSubAssemblies(transformedData);
      }
    } catch (error) {
      console.error("Error in POST request:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubAssemblies();
  }, []);

  return (
    <>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : featuredSubAssemblies?.length ? (
        <div>
          <h2 className="my-4 mt-10 text-2xl font-bold">Featured Sub Assemblies</h2>
          <div className="custom-scrollbar flex w-[280px] max-w-7xl flex-col gap-3 overflow-x-auto pb-2 xs:w-[340px] sm:w-[590px] md:w-[600px] lg:w-[990px] lg:flex-row xl:w-[1230px]">
            <Swiper
              modules={[Navigation, Pagination, Mousewheel]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              mousewheel={true}
              direction={"horizontal"}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="swiper-container w-full"
            >
              {featuredSubAssemblies.map((subAssembly, index) => (
                <SwiperSlide key={subAssembly.id + index + subAssembly.documentId}>
                  <Link href={`/sub-assemblies/${subAssembly.documentId}`}>
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition">
                      <div className="relative h-[200px] w-full border-b border-gray-200 p-1">
                        {subAssembly.media ? (
                          <BaseImage
                            width={subAssembly.media[0].formats?.actual?.width}
                            height={subAssembly.media[0].formats?.actual?.height}
                            src={subAssembly.media[0].formats?.actual?.url}
                            alt={subAssembly.name}
                            priority={true}
                            classes="h-full w-full object-contain rounded-t-lg"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <h3
                          title={subAssembly.name}
                          className="truncate text-center text-lg font-bold"
                        >
                          {subAssembly.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="custom-pagination mt-4 flex justify-center"></div>
        </div>
      ) : null}
    </>
  );
};

export default FeaturedSubAssemblies;
