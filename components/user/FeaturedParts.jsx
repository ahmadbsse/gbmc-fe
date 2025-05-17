import { BaseImage, BaseLoader } from "@/components/common";
import { useState, useEffect, useRef } from "react";
import apiClient from "@/utils/apiClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Autoplay } from "swiper/modules";
import { transformMedia, decodeText } from "@/utils";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brandMediaMap, setBrandMediaMap] = useState({});
  const swiperRef = useRef(null);
  const swiperInitialized = useRef(false);

  // Setup event listeners for slider navigation arrows
  useEffect(() => {
    // Only set up listeners after featuredParts are loaded
    if (featuredParts.length === 0 || !swiperRef.current) {
      return;
    }

    // Function to set up event listeners
    const setupEventListeners = () => {
      // Wait for the swiper to be fully initialized and DOM to be updated
      setTimeout(() => {
        const prevButton = document.querySelector(".swiper-button-prev");
        const nextButton = document.querySelector(".swiper-button-next");

        // Function to handle mouse enter event on prev button
        const handlePrevEnter = () => {
          if (swiperRef.current && swiperRef.current.swiper) {
            // Start sliding in reverse direction with small delay
            swiperRef.current.swiper.params.autoplay.delay = 1000;
            swiperRef.current.swiper.params.autoplay.reverseDirection = true;
            swiperRef.current.swiper.autoplay.start();
          }
        };

        // Function to handle mouse enter event on next button
        const handleNextEnter = () => {
          if (swiperRef.current && swiperRef.current.swiper) {
            // Start sliding in forward direction with small delay
            swiperRef.current.swiper.params.autoplay.delay = 1000;
            swiperRef.current.swiper.params.autoplay.reverseDirection = false;
            swiperRef.current.swiper.autoplay.start();
          }
        };

        // Function to handle mouse leave event
        const handleMouseLeave = () => {
          if (swiperRef.current && swiperRef.current.swiper) {
            // Stop autoplay when mouse leaves
            swiperRef.current.swiper.autoplay.stop();
          }
        };

        // Add event listeners if elements exist
        if (prevButton) {
          prevButton.addEventListener("mouseenter", handlePrevEnter);
          prevButton.addEventListener("mouseleave", handleMouseLeave);
        }

        if (nextButton) {
          nextButton.addEventListener("mouseenter", handleNextEnter);
          nextButton.addEventListener("mouseleave", handleMouseLeave);
        }

        // Store cleanup functions
        return () => {
          if (prevButton) {
            prevButton.removeEventListener("mouseenter", handlePrevEnter);
            prevButton.removeEventListener("mouseleave", handleMouseLeave);
          }

          if (nextButton) {
            nextButton.removeEventListener("mouseenter", handleNextEnter);
            nextButton.removeEventListener("mouseleave", handleMouseLeave);
          }
        };
      }, 500); // Give some time for Swiper to fully initialize and render buttons
    };

    // Set up listeners and store cleanup function
    const cleanup = setupEventListeners();

    // Clean up event listeners on component unmount or when featuredParts change
    return () => {
      if (cleanup) cleanup();
    };
  }, [featuredParts]);

  const getParts = async () => {
    try {
      setIsLoading(true);
      let url = `/parts?populate=*&filters[active]=true&filters[featured]=true&sort=createdAt:desc`;
      const res = await apiClient.GET(url);
      if (res && res.data.length > 0) {
        const parts = res.data.filter((part) => part.supplier.active);
        const transformedData = transformMedia(parts);
        transformedData.forEach((part) => {
          part.name = decodeText(part.name);
          part.supplier.name = decodeText(part.supplier.name);
        });
        setFeaturedParts(transformedData);
      }
    } catch (error) {
      console.error("Error in POST request:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMakes();
    getParts();
  }, []);

  function extractMediaUrlsByName(data) {
    const result = {};

    data.forEach((item) => {
      if (item.media && item.media.formats) {
        const formats = item.media.formats;
        const urls = {};

        for (const formatKey in formats) {
          urls[formatKey] = formats[formatKey].url;
        }
        result[decodeText(item.name)] = formats?.thumbnail?.url;
      }
    });

    setBrandMediaMap(result);
  }

  const getMakes = async () => {
    try {
      await apiClient.GET(`/suppliers?populate=*&filters[active]=true`).then(async (res) => {
        if (res && res.data.length > 0) {
          res.data.unshift({ name: "All", documentId: "" });
          res.data.forEach((brand) => {
            brand.name = decodeText(brand.name);
          });
          extractMediaUrlsByName(res.data);
        } else {
          extractMediaUrlsByName([]);
        }
      });
    } catch (error) {
      const message = error.message;
      console.error("Error in POST request:", message);
    }
  };

  return (
    <>
      {isLoading ? (
        <p className="mx-auto w-fit">
          <BaseLoader />
        </p>
      ) : featuredParts?.length ? (
        <div className="mb-9 sm:mb-0">
          <h2 className="my-4 text-2xl font-bold">Featured Parts</h2>
          <div className="custom-scrollbar flex w-[280px] max-w-7xl flex-col gap-3 overflow-x-auto pb-2 xs:w-[340px] sm:w-[590px] md:w-[600px] lg:w-[990px] lg:flex-row xl:w-[1230px]">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Mousewheel, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              mousewheel={true}
              direction={"horizontal"}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
              }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: true,
                enabled: false, // Initially disabled
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
              className="swiper-container w-full"
              onSwiper={(swiper) => {
                // Store the swiper instance once initialized
                swiperInitialized.current = true;
              }}
            >
              {featuredParts.map((part, index) => (
                <SwiperSlide key={part.id + index + part.documentId}>
                  <Link href={`/tractor-parts/${part.documentId}`}>
                    <div className="rounded-lg border border-gray-400 bg-white shadow-sm transition">
                      <div className="relative h-[200px] w-full border-b border-gray-400 p-1">
                        {part.media ? (
                          <>
                            <BaseImage
                              width={part.media[0].formats?.actual?.width}
                              height={part.media[0].formats?.actual?.height}
                              src={part.media[0].formats?.actual?.url}
                              alt={part.name}
                              priority={true}
                              classes="h-full w-full object-contain rounded-t-lg"
                            />
                          </>
                        ) : null}
                        {brandMediaMap[decodeText(part?.supplier?.name)] ? (
                          <div
                            title={part?.supplier?.name}
                            className="absolute right-2 top-2 max-h-6 max-w-12 rounded text-xs font-bold"
                          >
                            <BaseImage
                              width={60}
                              height={20}
                              src={brandMediaMap[decodeText(part?.supplier?.name)]}
                              alt={part?.supplier?.name}
                              priority={true}
                              classes="h-full w-full object-contain rounded-t-lg"
                            />
                          </div>
                        ) : null}
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
          <div className="custom-pagination mt-4 flex justify-center"></div>
        </div>
      ) : null}
    </>
  );
};

export default FeaturedParts;