import React, { useEffect, useRef, useState } from "react";
import { Tractor, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import Head from "next/head";

import { PageLayout } from "@/components/user";

import { Navbar, BaseButton, BaseImage, BaseLoader } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";

const TractorPartsHome = () => {
  const categories = [
    {
      title: "Tractor Parts",
      key: "tractor-parts",
      description: "Complete range of engine components",
      featured: true,
    },
    {
      title: "TXL (Sub Assemblies)",
      key: "sub-assemblies",
      description: "Gearbox and transmission components",
      featured: false,
    },
    {
      title: "Tractors",
      key: "tractors",
      description: "Pumps, valves, and hydraulic accessories",
      featured: false,
    },
  ];
  const suppliers = ["Ursus", "New Holland", "Massey Ferguson", "John Deere", "CNH Fiat", "Ford"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [parts, setParts] = useState([]);
  const [featuredParts, setFeaturedParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: selectedCategory.title, href: selectedCategory.key },
  ];
  const redirectToDetails = () => {
    router.push("/product-details");
  };

  const getParts = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/parts?populate=*&filters[active]=true").then(async (res) => {
        if (res && res.data.length > 0) {
          const transformedData = transformMedia(res.data);
          console.log(transformedData);
          setFeaturedParts(transformedData.filter((part) => part.featured));
        } else {
          setFeaturedParts([]);
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
    getParts();
  }, []);
  return (
    <>
      <Head>
        <title>{selectedCategory.title}</title>
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

      <PageLayout title={``} breadcrumbs={breadcrumbs}>
        <div className="grid gap-8">
          {/* Categories Section */}
          <section>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <div
                  onClick={() => setSelectedCategory(category)}
                  key={index}
                  className={`cursor-pointer rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg ${
                    category.title == selectedCategory.title
                      ? "border-2 border-secondary/50 bg-secondary/20"
                      : "bg-white"
                  } `}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Tractor
                      className={`h-8 w-8 ${category.title == selectedCategory.title ? "text-secondary" : ""}`}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{category.title}</h3>
                  <p className="mb-4">{category.description}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Featured Parts Section */}
          <section>
            {selectedCategory.key == "tractor-parts" ? (
              <div className="flex flex-wrap justify-start text-xs lg:justify-center lg:gap-5 lg:text-base">
                {suppliers.map((brand, index) => (
                  <span
                    className={`cursor-pointer p-2 font-medium uppercase hover:text-black md:p-4`}
                    key={index}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <h2 className="mb-3 text-2xl font-bold">Featured Parts</h2>
              <div className="flex items-center gap-2">
                {/* Navigation Buttons */}
                <button onClick={() => {}} className="border p-2 shadow-lg transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button onClick={() => {}} className="border p-2 shadow-lg transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative w-full">
              {/* Scrollable Container */}
              {isLoading ? (
                <div className="mx-auto w-fit">
                  <BaseLoader />
                </div>
              ) : featuredParts.length !== 0 ? (
                <div className="flex items-center gap-4 overflow-x-hidden py-2">
                  {featuredParts.map((part) => (
                    <div
                      key={part.id}
                      className="w-full flex-none overflow-hidden rounded-lg bg-white shadow-md sm:w-1/2 lg:w-1/4"
                    >
                      <div className="h-full">
                        <div className="relative">
                          <div className="h-[200px] w-full">
                            <BaseImage
                              width={part.media[0].formats?.actual?.width}
                              height={part.media[0].formats?.actual?.height}
                              src={part.media[0].formats?.actual?.url}
                              alt={part.name}
                              priority={true}
                              classes="h-full w-full object-cover"
                            />
                          </div>
                          {part.featured ? (
                            <div className="absolute right-2 top-2 rounded-full bg-solidGray/40 p-1">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                            </div>
                          ) : null}
                        </div>
                        <div className="px-3 py-1">
                          <h3 className="my-2 text-lg font-semibold">{part.name}</h3>
                          <BaseButton
                            loading={false}
                            type="submit"
                            rounded
                            handleClick={redirectToDetails}
                          >
                            <span className="px-3">View Details</span>
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default TractorPartsHome;
