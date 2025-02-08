import React, { useEffect, useState } from "react";
import Head from "next/head";
import { appData } from "@/constants";
import { BaseLoader, Navbar, PageLayout } from "@/components/common";
import EngineeringListingCard from "@/components/user/EngineeringListingCard";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import Image from "next/image";

const EngineeringHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [engineeringComponents, setEngineeringComponents] = useState([]);
  const getEngineering = async () => {
    try {
      setIsLoading(true);
      await apiClient
        .GET("/engineering-components?populate=*&filters[active]=true")
        .then(async (res) => {
          if (res && res.data.length > 0) {
            const transformedData = transformMedia(res.data);
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
      <Head>
        <title>Engineering Components | {appData.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="relative h-96">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/50 to-slate-900/70" />
        <div className="relative h-full">
          <Image
            src="/assets/engineering-component-banner.jpg"
            alt="Factory"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Manufactoring Processes
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
      >
        {isLoading ? (
          <div className="mx-auto w-fit">
            <BaseLoader />
          </div>
        ) : (
          <div className="grid h-screen gap-8">
            {/* Featured Components Section */}
            {engineeringComponents.length != 0 ? (
              <section>
                <div className="grid gap-4 md:grid-cols-4">
                  {engineeringComponents.map((component, index) => (
                    <EngineeringListingCard
                      key={index}
                      id={component.documentId}
                      image={component.media[0].formats.thumbnail.url}
                      title={component.name}
                      featured={component.featured}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <p className="mx-auto w-fit">No Data Found</p>
            )}
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default EngineeringHome;
