import React, { useEffect, useState } from "react";
import { Tractor } from "lucide-react";
import Head from "next/head";
import { appData } from "@/constants";
import { FeaturedParts, AllParts } from "@/components/user";

import { Navbar, PageLayout } from "@/components/common";
import apiClient from "@/utils/apiClient";

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
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: selectedCategory.title, href: selectedCategory.key },
  ];
  const getSuppliers = async () => {
    try {
      await apiClient.GET(`/suppliers?filters[active]=true`).then(async (res) => {
        if (res && res.data.length > 0) {
          setSuppliers(res.data);
        } else {
          setSuppliers([]);
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      console.error("Error in POST request:", message);
    }
  };
  useEffect(() => {
    getSuppliers();
  }, []);
  return (
    <>
      <Head>
        <title>
          {selectedCategory.title} | {appData.name}
        </title>
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

          <section className="min-h-[300px]">
            {selectedCategory.key == "tractor-parts" ? (
              <div className="flex flex-wrap justify-start text-xs lg:justify-center lg:gap-5 lg:text-base">
                {suppliers.map((brand, index) => (
                  <span
                    onClick={() => setSelectedSupplier(brand.documentId)}
                    className={`cursor-pointer p-2 font-medium uppercase hover:text-black md:p-4`}
                    key={index}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            ) : null}
            <FeaturedParts />
            <AllParts selectedSupplier={selectedSupplier} />
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default TractorPartsHome;
