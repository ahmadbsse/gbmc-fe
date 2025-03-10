import React from "react";
import { Tractor } from "lucide-react";
import Image from "next/image";
import { Navbar, PageLayout, SeoHead } from "@/components/common";
import Link from "next/link";

const TractorPage = () => {
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
    { text: categories[2].title, href: categories[2].key },
  ];
  return (
    <>
      <SeoHead title={categories[2].title} />
      <Navbar setTab={() => {}} />
      <PageLayout title={``} breadcrumbs={breadcrumbs}>
        <div className="grid gap-8">
          {/* Categories Section */}
          <section>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Link key={index} href={category.key}>
                  <div
                    className={`cursor-pointer rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg ${
                      category.title == categories[2].title
                        ? "border-2 border-secondary/50 bg-secondary/20"
                        : "bg-white"
                    } `}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <Tractor
                        className={`h-8 w-8 ${category.title == categories[2].title ? "text-secondary" : ""}`}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{category.title}</h3>
                    <p className="mb-4">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          {/* Featured Parts Section */}

          <section className="min-h-[300px]">
            <Image
              className="mx-auto"
              src="/assets/tractor.jpg"
              alt="Tractor Parts"
              width={1030}
              height={771}
            />
          </section>
        </div>
      </PageLayout>
    </>
  );
};
export default TractorPage;
