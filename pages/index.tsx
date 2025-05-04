import React from "react";
import { Settings, Tractor, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useMarqueeStateStore from "@/stores/marquee";
// import { Footer } from "../components/user";
import { Navbar, BaseButton, SeoHead } from "@/components/common";

const Home = () => {
  const { hasMarquee } = useMarqueeStateStore();
  return (
    <>
      <SeoHead title="Home" />
      <div className="flex flex-col xl:h-screen xl:overflow-hidden">
        {/* Navigation */}

        <Navbar setTab={() => {}} />

        {/* Main Split Screen Sections */}
        <div
          className={`flex flex-1 flex-col md:flex-row ${hasMarquee ? "mt-28" : "mt-16 md:mt-0"}`}
        >
          {/* Engineering Components Section */}
          <div className="relative cursor-pointer md:h-screen md:w-1/2">
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
                <h2 className="mb-4 text-center text-2xl font-bold uppercase lg:text-3xl">
                  Engineering Components
                </h2>
                <p className="mb-8 max-w-md text-center text-lg">
                  Precision-engineered components for industrial applications.
                </p>

                <Link href="/engineering">
                  <BaseButton loading={false} type="submit" handleClick={() => {}}>
                    <p className="flex items-center gap-2 px-[70px] py-3 text-[11px] xs:text-sm">
                      Explore
                      <ChevronRight size={20} />
                    </p>
                  </BaseButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Tractor Parts Section */}
          <div className="relative cursor-pointer md:h-screen md:w-1/2">
            <div className="absolute inset-0 bg-primary" />

            <div className="relative flex h-full flex-col items-center justify-center p-8 text-black">
              <Tractor size={64} className="mb-6" />
              <h2 className="mb-4 text-center text-2xl font-bold uppercase lg:text-3xl">
                Tractor Parts
              </h2>
              <p className="mb-8 max-w-md text-center text-lg text-black">
                High-quality replacement parts for agricultural machinery.
              </p>

              <Link href="/tractor-parts">
                <button
                  type="submit"
                  className="group relative h-[42px] w-full overflow-hidden rounded bg-[#363633] px-10 text-[11px] font-bold uppercase text-white transition-all duration-300 hover:bg-[#4a4a46] xs:text-sm md:min-w-[7rem] lg:min-w-[8rem]"
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
