import React from "react";
import { PenTool, Cog, Activity } from "lucide-react";
import Head from "next/head";

import { PageLayout, FeatureCard } from "../components/user";
import { Navbar } from "@/components/common";
import EngineeringListingCard from "@/components/user/EngineeringListingCard";

const EngineeringHome = () => {
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
                <EngineeringListingCard
                  key={index}
                  image={component.image}
                  title={component.title}
                  description={component.description}
                />
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default EngineeringHome;
