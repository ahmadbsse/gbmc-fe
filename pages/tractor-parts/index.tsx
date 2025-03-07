import React from "react";
import { Tractor, Cog } from "lucide-react";
import { FeaturedParts, AllParts } from "@/components/user";
import { Navbar, PageLayout, SeoHead } from "@/components/common";
import Link from "next/link";

const TractorPartsHome = () => {
  const categories = [
    {
      title: "Tractor Parts",
      key: "tractor-parts",
      icon: Tractor,
    },
    {
      title: "TXL (Sub Assemblies)",
      key: "sub-assemblies",
      icon: Cog,
    },
    // {
    //   title: "Tractors",
    //   key: "tractors",
    //   description: "Pumps, valves, and hydraulic accessories",
    // },
  ];

  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: categories[0].title, href: categories[0].key },
  ];

  return (
    <>
      <SeoHead title={categories[0]?.title} />
      <Navbar setTab={() => {}} />
      <PageLayout title={``} breadcrumbs={breadcrumbs}>
        <div className="grid overflow-x-hidden lg:gap-8">
          {/* Categories Section */}

          <div className="flex w-full flex-col gap-6 sm:min-w-[280px] sm:max-w-max sm:flex-row lg:w-auto">
            {categories.map((category, index) => (
              <Link key={index} href={category?.key}>
                <div
                  className={`w-full min-w-[285px] cursor-pointer rounded-lg p-6 pr-10 shadow-md transition-all duration-300 hover:shadow-lg ${
                    category?.title == categories[0]?.title
                      ? "border-2 border-secondary/50 bg-secondary/20"
                      : "bg-white"
                  } `}
                >
                  <div className="flex w-full items-center gap-4">
                    <category.icon
                      className={`h-8 w-8 ${category?.title == categories[0]?.title ? "text-secondary" : ""}`}
                    />
                    <h3 className="text-lg font-semibold">{category?.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Featured Parts Section */}

          <section className="min-h-[300px]">
            <FeaturedParts />
            <AllParts />
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default TractorPartsHome;
