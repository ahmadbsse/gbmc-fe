import React, { useEffect, useState } from "react";
import Head from "next/head";

import { PageLayout } from "@/components/user";
import { BaseLoader, Navbar } from "@/components/common";
import EngineeringListingCard from "@/components/user/EngineeringListingCard";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";

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
        <title>Engineering Components</title>
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
      <Navbar showSearchbar />
      <PageLayout
        title="Engineering Procedures"
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Engineering", href: "/engineering" },
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
