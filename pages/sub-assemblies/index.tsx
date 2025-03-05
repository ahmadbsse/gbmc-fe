import React from "react";
import { Tractor } from "lucide-react";
import { FeaturedSubAssemblies, AllSubAssemblies } from "@/components/user";
import { Navbar, PageLayout, SeoHead } from "@/components/common";
import Link from "next/link";

const SubAssemblies = () => {
  const categories = [
    {
      title: "Tractor Parts",
      key: "tractor-parts",
      description: "Complete range of engine components",
    },
    {
      title: "TXL (Sub Assemblies)",
      key: "sub-assemblies",
      description: "Gearbox and transmission components",
    },
    // {
    //   title: "Tractors",
    //   key: "tractors",
    //   description: "Pumps, valves, and hydraulic accessories",
    // },
  ];

  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: categories[1].title, href: categories[1].key },
  ];

  return (
    <>
      <SeoHead title={categories[1]?.title} />
      <Navbar setTab={() => {}} />
      <PageLayout title={``} breadcrumbs={breadcrumbs}>
        <div className="grid overflow-x-hidden lg:gap-8">
          {/* Categories Section */}

          <div className="flex w-full max-w-[340px] flex-col gap-6 sm:max-w-[380px] md:max-w-max md:flex-row lg:w-auto">
            {categories.map((category, index) => (
              <Link key={index} href={category?.key}>
                <div
                  className={`cursor-pointer rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg ${
                    category?.title == categories[1]?.title
                      ? "border-2 border-secondary/50 bg-secondary/20"
                      : "bg-white"
                  } `}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Tractor
                      className={`h-8 w-8 ${category?.title == categories[1]?.title ? "text-secondary" : ""}`}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{category?.title}</h3>
                  <p className="mb-4">{category?.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <section className="min-h-[300px]">
            <FeaturedSubAssemblies />
            <AllSubAssemblies />
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default SubAssemblies;
