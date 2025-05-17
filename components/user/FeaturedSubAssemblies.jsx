import { BaseImage, BaseLoader } from "@/components/common";
import { useState, useEffect,useRef } from "react";
import apiClient from "@/utils/apiClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel,Autoplay } from "swiper/modules";
import { transformMedia, decodeText } from "@/utils";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedSubAssemblies = () => {
  const [featuredSubAssemblies, setFeaturedSubAssemblies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef(null);
    const swiperInitialized = useRef(false);
  
    // Setup event listeners for slider navigation arrows
    useEffect(() => {
      // Only set up listeners after featuredSubAssemblies are loaded
      if (featuredSubAssemblies.length === 0 || !swiperRef.current) {
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
  
      // Clean up event listeners on component unmount or when featuredSubAssemblies change
      return () => {
        if (cleanup) cleanup();
      };
    }, [featuredSubAssemblies]);

  const getSubAssemblies = async () => {
    try {
      setIsLoading(true);
      let url = `/sub-assemblies?populate=*&filters[active]=true&filters[featured]=true&sort=createdAt:desc`;
      const res = await apiClient.GET(url);
      if (res && res.data.length > 0) {
        const transformedData = transformMedia(res.data);
        transformedData.forEach((subAssembly) => {
          subAssembly.name = decodeText(subAssembly.name);
        });
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
        <div className="mb-9 sm:mb-0">
          <h2 className="my-4 mt-10 text-2xl font-bold">Featured Assemblies</h2>
          <div className="custom-scrollbar flex w-[280px] max-w-7xl flex-col gap-3 overflow-x-auto pb-2 xs:w-[340px] sm:w-[590px] md:w-[600px] lg:w-[990px] lg:flex-row xl:w-[1230px]">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Mousewheel, Autoplay]}
              spaceBetween={24}
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
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: true,
                enabled: false, // Initially disabled
              }}
              className="swiper-container w-full"
               onSwiper={(swiper) => {
                // Store the swiper instance once initialized
                swiperInitialized.current = true;
              }}
            >
              {featuredSubAssemblies.map((subAssembly, index) => (
                <SwiperSlide key={subAssembly.id + index + subAssembly.documentId}>
                  <Link href={`/sub-assemblies/${subAssembly.documentId}`}>
                    <div className="rounded-lg border border-gray-400 bg-white shadow-sm transition">
                      <div className="relative h-[200px] w-full border-b border-gray-400 p-1">
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
