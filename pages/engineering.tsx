import React from "react";
import { PenTool, Cog, Activity } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { PageLayout, FeatureCard } from "../components/user";
import { Navbar } from "@/components/common";

const EngineeringHome = () => {
  const router = useRouter();
  const procedures = [
    {
      title: "Precision Machining",
      description: "High-precision CNC machining for complex components",
      icon: PenTool,
    },
    {
      title: "Quality Testing",
      description: "Rigorous quality control and testing procedures",
      icon: Activity,
    },
    {
      title: "Custom Engineering",
      description: "Tailored engineering solutions for specific needs",
      icon: Cog,
    },
  ];

  const featuredComponents = [
    {
      title: "Component 1",
      description: "Innovative components for solar and wind energy systems",
      image: "/assets/4.jpg",
    },
    {
      title: "Component 1",
      description: "Innovative components for solar and wind energy systems",
      image: "/assets/5.jpg",
    },
    {
      title: "Component 1",
      description: "Innovative components for solar and wind energy systems",
      image: "/assets/6.jpg",
    },
    {
      title: "Component 1",
      description: "Innovative components for solar and wind energy systems",
      image: "/assets/7.jpg",
    },
  ];
  return (
    <>
      <Navbar showSearchbar />
      <PageLayout
        title="Engineering Procedures"
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Engineering", href: "/engineering" },
        ]}
      >
        <div className="grid gap-8">
          {/* Procedures Section */}
          <section>
            <div className="grid gap-6 md:grid-cols-3">
              {procedures.map((procedure, index) => (
                <FeatureCard
                  key={index}
                  title={procedure.title}
                  description={procedure.description}
                  icon={procedure.icon}
                  featured={index === 0}
                />
              ))}
            </div>
          </section>

          {/* Featured Components Section */}
          <section>
            <h2 className="mb-6 text-2xl font-bold">Featured Components</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {featuredComponents.map((component, index) => (
                <div
                  key={index}
                  className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg"
                  onClick={() => {
                    router.push("/engineering-article");
                  }}
                >
                  <Image
                    height={160}
                    width={240}
                    src={component.image}
                    alt={component.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{component.title}</h3>
                    <p className="text-sm">{component.description}</p>
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

export default EngineeringHome;
