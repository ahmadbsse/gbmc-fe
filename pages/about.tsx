import Image from "next/image";
import { appData } from "@/constants";
import { Navbar, SeoHead } from "@/components/common";
import useMarqueeStateStore from "@/stores/marquee";
const AboutPage = () => {
  const { hasMarquee } = useMarqueeStateStore();

  return (
    <>
      <SeoHead title="About" />
      <div className={`min-h-screen bg-slate-50 ${hasMarquee ? "mt-28" : "mt-16"}`}>
        {/* Navigation */}
        <Navbar setTab={() => {}} />

        {/* Hero Section */}
        <div className="relative h-96 lg:h-[570px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/30 to-slate-900/50" />
          <div className="relative h-full">
            <Image src="/assets/aboutus.png" alt="About us Banner" fill={true} className="object-fill" />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
            <div className="max-w-3xl px-4">
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Global Leader in Engineering & Agricultural Solutions
              </h1>
              <p className="text-xl text-slate-200 font-medium">
                Delivering precision engineering and quality tractor parts worldwide since 1980
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Company Stats */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">About Us</h2>
            <ul className="flex list-inside flex-col gap-3">
              <li>
                <strong className="uppercase">{appData.name}</strong> is an industrial manufacturing
                network specializing in wide variety of processes .Thus we manufacture and deliver
                world-wide customer-specific and ready-to-install components such as Drop Forgings,
                Gray Iron Castings, Gears, CNC turning and milling parts, Sheet Metal parts, Large
                Diameter Turnings, Fabrication & Wire EDM for the most varied industrial sectors and
                in all quantities.
              </li>
              <li>
                Even with Small to Medium Quantities we can offer economical prices. Good Quality
                and Competitive prices as compared to India & China. Our principle is highest
                flexibility and Quality in combination with customized inspection procedures,
                efficient communication, fast logistics and a comprehensive service. This way we
                achieve highest reliability & this distinguishes us as a dynamic and ambitious
                enterprise with continuous growth and development.
              </li>
              <li>
                Take advantage of our performance & of our low cost-best quality manufacturing
                network! Convince yourself of the excellent quality of our services while reducing
                your total cost in the same time.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
