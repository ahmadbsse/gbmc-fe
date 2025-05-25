import React, { useEffect, useState } from "react";
import { BaseLoader, Navbar, PageLayout, SeoHead } from "@/components/common";
import EngineeringListingCard from "@/components/user/EngineeringListingCard";
import apiClient from "@/utils/apiClient";
import { decodeText, transformMedia } from "@/utils";
import Image from "next/image";
import useMarqueeStateStore from "@/stores/marquee";

const EngineeringHome = () => {
  const { hasMarquee } = useMarqueeStateStore();
  const [isLoading, setIsLoading] = useState(false);
  const [engineeringComponents, setEngineeringComponents] = useState([]);

  const getEngineering = async () => {
    try {
      setIsLoading(true);
      await apiClient
        .GET("/engineering-components?populate=*&filters[active]=true&sort=createdAt:desc")
        .then(async (res) => {
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
            transformedData.forEach((data) => {
              data.name = decodeText(data.name);
            });
            setEngineeringComponents(transformedData);
          } else {
            setEngineeringComponents([]);
          }
        });
    } catch (error) {
      const message = (error as Error).message;
      console.error("Error in POST request:", message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEngineering();
  }, []);

  return (
    <>
      <SeoHead title={`Engineering Components`} />
      <Navbar setTab={() => {}} />
      <div className={`relative h-96 lg:h-[570px] ${hasMarquee ? "mt-28" : "mt-16"}`}>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/30 to-slate-900/50" />
        <div className="relative h-full">
          <Image
            src="/assets/ecom.png"
            alt="Engineering Component Banner"
            fill={true}
            className="object-fill"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Manufacturing Processes
            </h1>
          </div>
        </div>
      </div>
      <PageLayout
        title=""
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Engineering Components", href: "/engineering" },
        ]}
        paddingTop={false}
      >
        {isLoading ? (
          <div className="mx-auto w-fit">
            <BaseLoader />
          </div>
        ) : (
          <div className="h-screen">
            {/* Featured Components Section */}
            {engineeringComponents?.length != 0 ? (
              <div className="grid w-fit grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:pr-0 xl:grid-cols-4">
                {engineeringComponents?.map((component, index) => (
                  <EngineeringListingCard
                    key={index}
                    id={component?.documentId}
                    image={component?.hero_image}
                    isImage={component?.hero_image?.mime?.includes("image")}
                    heroVideo={
                      component?.hero_image?.mime?.includes("image") ? null : component?.hero_image
                    }
                    title={component?.name}
                    featured={component?.featured}
                  />
                ))}
              </div>
            ) : (
              <p className="min-h-36 w-fit px-5">No Data Found</p>
            )}
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default EngineeringHome;
