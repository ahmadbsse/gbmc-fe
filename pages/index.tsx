import React from "react";
import { Settings, Tractor, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { Footer } from "../components/user";
import { Navbar, BaseButton, SeoHead } from "@/components/common";

const Home = () => {
  return (
    <>
      <SeoHead title="Home" />
      <div className="flex flex-col xl:h-screen xl:overflow-hidden">
        {/* Navigation */}
        <div className="z-50">
          <Navbar setTab={() => {}} />
        </div>

        {/* Main Split Screen Sections */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Engineering Components Section */}
          <div className="relative order-2 cursor-pointer md:order-1 md:h-screen md:w-1/2">
            <div className="absolute inset-0" />
            <Image
              src="/assets/banner01.jpg"
              alt="Engineering"
              height={1200}
              width={1000}
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative flex h-full flex-col items-center justify-center p-8 text-black">
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
                      Explore
                      <ChevronRight size={20} />
                    </p>
                  </BaseButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Tractor Parts Section */}
          <div className="relative order-1 cursor-pointer md:order-2 md:h-screen md:w-1/2">
            <div className="absolute inset-0 bg-primary" />

            <div className="relative flex h-full flex-col items-center justify-center p-8 text-black">
              <Tractor size={64} className="mb-6" />
              <h2 className="mb-4 text-center text-2xl font-bold lg:text-4xl">Tractor Parts</h2>
              <p className="mb-8 max-w-md text-center text-lg text-black">
                High-quality replacement parts for agricultural machinery. Reliable and durable
                solutions.
              </p>

              <Link href="/tractor-parts">
                <button
                  type="submit"
                  className="group relative h-[42px] w-full overflow-hidden rounded-lg bg-[#363633] px-10 text-sm font-bold uppercase text-white transition-all duration-300 hover:bg-[#4a4a46] md:min-w-[7rem] lg:min-w-[8rem]"
                >
                  <p className="flex items-center justify-center gap-2 px-7 py-3">
                    View Catalog
                    <ChevronRight size={20} />
                  </p>
                  <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]" />
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
