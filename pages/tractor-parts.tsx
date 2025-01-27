import React, { useState } from "react";
import Image from "next/image";
import { Tractor, Star } from "lucide-react";
import { useRouter } from "next/router";
import Head from "next/head";

import { PageLayout } from "@/components/user";

import { Navbar, BaseButton } from "@/components/common";

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
  const router = useRouter();

  const featuredParts = [
    {
      name: "Cylinder Head Assembly",
      category: "Engine Parts",
      image: "/assets/10.jpg",
    },
    {
      name: "Transmission Gearbox",
      category: "Transmission",
      image: "/assets/1.png",
    },
    {
      name: "Hydraulic Pump",
      category: "Hydraulic Systems",
      image: "/assets/1.JPG",
    },
    {
      name: "Hydraulic Pump",
      category: "Hydraulic Systems",
      image: "/assets/1.JPG",
    },
  ];
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: selectedCategory.title, href: selectedCategory.key },
  ];
  const redirectToDetails = () => {
    router.push("/product-details");
  };

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

      <PageLayout title={`${selectedCategory.title}`} breadcrumbs={breadcrumbs}>
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
            {selectedCategory.key == "parts" ? (
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
            <h2 className="mb-6 text-2xl font-bold">Featured Parts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredParts.map((part, index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-white shadow-md">
                  <div className="relative">
                    <Image
                      src={part.image}
                      alt={part.name}
                      height={256}
                      width={256}
                      className="h-44 w-full object-cover"
                    />
                    <div className="absolute right-4 top-4">
                      <Star className="h-6 w-6 fill-current text-yellow-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-secondary">{part.category}</span>
                    <h3 className="mb-4 mt-2 text-xl font-semibold">{part.name}</h3>
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
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default TractorPartsHome;
