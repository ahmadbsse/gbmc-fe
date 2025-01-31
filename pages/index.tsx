import React from "react";
import { Settings, Tractor, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// import { Footer } from "../components/user";
import { Navbar, BaseButton } from "@/components/common";
import { appData } from "@/constants";
const Home = () => {
  return (
    <>
      <Head>
        <title>{appData.name} | Global Meccanica</title>
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

      <div className="flex flex-col xl:h-screen xl:overflow-hidden">
        {/* Navigation */}
        <Navbar />

        {/* Main Split Screen Sections */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Engineering Components Section */}
          <div className="relative m-4 cursor-pointer md:w-1/2 lg:m-0">
            <div className="absolute inset-0 z-10" />
            <Image
              src="/assets/banner01.jpg"
              alt="Engineering"
              height={1200}
              width={1000}
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-20 flex h-full flex-col items-center justify-center p-8 text-black">
              <div className="flex flex-col items-center bg-gray-50 bg-opacity-70 p-3">
                <Settings size={64} className="mb-6" />
                <h2 className="mb-4 text-center text-2xl font-bold lg:text-4xl">
                  Engineering Components
                </h2>
                <p className="mb-8 max-w-md text-center text-lg">
                  Precision-engineered components for industrial applications. Built to your exact
                  specifications.
                </p>

                <Link href="/engineering">
                  <BaseButton loading={false} type="submit" rounded handleClick={() => {}}>
                    <p className="flex items-center gap-2 px-7 py-3">
                      Explore Components
                      <ChevronRight size={20} />
                    </p>
                  </BaseButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Tractor Parts Section */}
          <div className="relative m-4 cursor-pointer md:w-1/2 lg:m-0">
            <div className="absolute inset-0 z-10 bg-primary" />

            <div className="relative z-20 flex h-full flex-col items-center justify-center p-8 text-black">
              <Tractor size={64} className="mb-6" />
              <h2 className="mb-4 text-center text-2xl font-bold lg:text-4xl">Tractor Parts</h2>
              <p className="mb-8 max-w-md text-center text-lg text-black">
                High-quality replacement parts for agricultural machinery. Reliable and durable
                solutions.
              </p>

              <Link href="/tractor-parts">
                <button
                  type="submit"
                  className="group relative z-10 h-[42px] w-full overflow-hidden rounded-lg bg-[#363633] px-10 text-sm font-bold uppercase text-white transition-all duration-300 hover:bg-[#4a4a46] md:min-w-[7rem] lg:min-w-[8rem]"
                >
                  <p className="flex items-center justify-center gap-2 px-7 py-3">
                    View Catalog
                    <ChevronRight size={20} />
                  </p>
                  <div className="absolute inset-0 -z-10 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Home;
