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
        <div className="relative h-96 h-[280px] sm:h-[360px] md:h-[400px] lg:h-[570px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/30 to-slate-900/50" />
          <div className="relative h-full">
            <Image
              src="/assets/aboutus-banner.png"
              alt="About us Banner"
              fill={true}
              className="object-fill"
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
            <div className="max-w-3xl px-4">
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                About us
              </h1>
              {/* <p className="text-xl font-medium text-slate-200">
                Delivering precision engineering and quality tractor parts worldwide since 1980
              </p> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Company Stats */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            {/* <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">About Us</h2> */}
            <ol className="flex list-inside flex-col gap-3">
              <li className="text-xl/10">
                <strong>{appData.name}:</strong> Your Global Partner for
                Precision Engineered Components
              </li>
              <li className="space-y-1">
                Global Meccanica is a dynamic, worldwide industrial manufacturing network, expertly
                delivering custom, ready-to-install components across diverse processes. We
                specialize in:
              </li>
              <li>
                <ul className="list-inside list-disc gap-3 space-y-1 indent-5">
                  <li>Ductile & Grey Iron Castings</li>
                  <li>Precision CNC Turning & Milling</li>
                  <li>Micro Machining</li>
                  <li>Ring Rolling (Forged Rings)</li>
                  <li>Ring Gears with Internal Teeth</li>
                </ul>
              </li>
              <li>
                <strong className="text-xl/10">Why Partner with Global Meccanica?</strong>
              </li>
              <li>
                <ul className="list-inside list-decimal space-y-2 text-md/10">
                  <li>
                    <strong>Unmatched Flexibility & Value:</strong> We serve industries worldwide
                    and excel at projects of any volume. Enjoy exceptionally economical pricing,
                    especially advantageous for small to medium-sized orders – without compromising
                    on quality.
                  </li>
                  <li>
                    <strong>Superior Quality & Global Competitiveness:</strong> We deliver
                    components that consistently meet the highest standards, offering superior
                    quality and more competitive pricing than traditional manufacturing hubs like
                    India and China.
                  </li>
                  <li>
                    <strong>Reliability Built on Core Principles: </strong> Our commitment to{" "}
                    <strong>flexibility</strong> and <strong>quality</strong> is unwavering. This is
                    embedded in our:
                    <ul className="list-inside list-disc gap-3 indent-5 space-y-2">
                      <li>
                        <strong>Customized Inspection:</strong> Rigorous, tailored quality control.
                      </li>
                      <li>
                        <strong>Efficient Communication:</strong> Seamless interaction throughout
                        your project.
                      </li>
                      <li>
                        <strong>Fast, Global Logistics:</strong> Reliable worldwide delivery.
                      </li>
                      <li>
                        <strong>Comprehensive Service:</strong> End-to-end partnership and support.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-xl/10">Expertise You Can Trust</strong>
              </li>
              <li>
                Guided by <strong>Mr. Irfan Salam,</strong> a seasoned Manufacturing Engineer with
                deep expertise in project management, global sourcing, design, development, and
                marketing, Global Meccanica is a growing, ambitious enterprise dedicated to
                continuous improvement and exceeding expectations.
              </li>
              <li>
                <strong>Experience the Global Meccanica Advantage:</strong>
              </li>
              <li>
                <strong>
                  Leverage our high-performance network to source best-quality components at lower
                  total costs.
                </strong>{" "}
                Discover how our commitment to excellence directly benefits your bottom line.
              </li>
              <li>
                <strong>Ready to optimize your manufacturing?</strong> Contact Global Meccanica
                today to discuss your specific needs and explore how we can become your trusted
                global manufacturing partner.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
