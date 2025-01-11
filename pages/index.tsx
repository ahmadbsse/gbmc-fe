import React from "react";
import { Settings, Tractor, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import { Footer } from "../components/user";
import { Navbar, BaseButton } from "@/components/common";
import { appData } from "@/constants";
const Home = () => {
  return (
    <>
      <Head>
        <title>{appData.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        {/* <meta property="og:url:secure_url" content="Page URL" /> */}
        {/* <meta
          property="og:image:secure_url"
          content="Image Link"
        /> */}
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col xl:h-screen xl:overflow-hidden">
        {/* Navigation */}
        <Navbar />

        {/* Main Split Screen Sections */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Engineering Components Section */}
          <div className="relative m-4 cursor-pointer md:w-1/2 lg:m-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
            <Image
              src="/assets/engineering-comp.webp"
              alt="Engineering"
              height={1200}
              width={1000}
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-20 flex h-full flex-col items-center justify-center p-8 text-white">
              <Settings size={64} className="mb-6" />
              <h2 className="mb-4 text-center text-2xl font-bold lg:text-4xl">
                Engineering Components
              </h2>
              <p className="mb-8 max-w-md text-center text-lg text-slate-200">
                Precision-engineered components for industrial applications. Built to your exact
                specifications.
              </p>

              <Link href="/engineering">
                <BaseButton id="viewDetailsButton" type="submit" rounded handleClick={() => {}}>
                  <p className="flex items-center gap-2 px-7 py-3">
                    Explore Components
                    <ChevronRight size={20} />
                  </p>
                </BaseButton>
              </Link>
            </div>
          </div>

          {/* Tractor Parts Section */}
          <div className="relative m-4 cursor-pointer md:w-1/2 lg:m-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900/50 to-gray-900/80" />
            <Image
              src="/assets/tractor-parts.webp"
              alt="Tractor Parts"
              priority
              height={1000}
              width={1000}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-20 flex h-full flex-col items-center justify-center p-8 text-white">
              <Tractor size={64} className="mb-6" />
              <h2 className="mb-4 text-center text-2xl font-bold lg:text-4xl">Tractor Parts</h2>
              <p className="mb-8 max-w-md text-center text-lg text-slate-200">
                High-quality replacement parts for agricultural machinery. Reliable and durable
                solutions.
              </p>

              <Link href="/tractor-parts">
                <BaseButton id="viewDetailsButton" type="submit" rounded handleClick={() => {}}>
                  <p className="flex items-center gap-2 px-7 py-3">
                    View Parts Catalog
                    <ChevronRight size={20} />
                  </p>
                </BaseButton>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
