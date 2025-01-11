import Image from "next/image";
import { useState } from "react";

import { Navbar } from "@/components/common";

const Article = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const data = {
    name: "Design Procedure",
    heading: "We offer plate cutting components according to customer blueprints",
    description:
      "Our offer includes sheet blanks, further processed welded assemblies and machining blanks, gas and plasma cutting, bending, rolling, shot blasting, machining and welding, as well as heat treatment. And from our network, we can also offer water and laser cutting and surface treatment.",
    services:
      "Gas and plasma cutting, bending, rolling, shot blasting, machining and welding, as well as heat treatment",
    thickenss: "3‒220 mm",
    dickSize: "2,500‒9,000 mm",
    materials: "Structural steel, wear plates, high-strength material and boron steel",
    products: "Plate cutting components, further processed welded assemblies and machining blanks",
    pressBreak: "800 tn. and 6 m edging length",
  };
  const images = [
    "/assets/12.jpg",
    "/assets/dummy_1.webp",
    "/assets/dummy_2.webp",
    "/assets/dummy_3.webp",
    "/assets/dummy_4.webp",
  ];
  return (
    <>
      <Navbar />
      <div className="mt-1 lg:px-16">
        <div className="relative">
          <video className="h-auto w-full" autoPlay muted loop>
            <source src="/assets/eng-detail.mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="absolute bottom-5 left-7 text-xl font-semibold text-white lg:bottom-0 lg:left-20 lg:top-20 lg:text-4xl">
            {data.name}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-4 lg:py-8">
        <div className="container">
          <h2 className="pb-3 font-semibold lg:text-2xl">{data.heading}</h2>

          <p className="text-sm lg:text-base">{data.description}</p>
          <section id="projects" className="pt-5 lg:py-8">
            <article className="reverse grid grid-cols-1 md:grid-cols-10">
              <div className="rounded-lg bg-[#707070] p-4 text-sm text-white lg:text-base">
                <div className="flex flex-col gap-2 py-7 lg:w-[400px] lg:gap-5 lg:px-11">
                  <h2 className="text-xl font-bold lg:text-2xl">Plate Service, Leppävesi</h2>
                  <p className="">
                    <strong>
                      Services:
                      <br />
                    </strong>
                    <span className="text-sm">{data.services}</span>
                    <strong>
                      <br />
                    </strong>
                  </p>
                  <p>
                    <strong>Plate thickness:</strong>
                    <br />
                    <span className="text-sm">{data.thickenss}</span>
                  </p>
                  <p>
                    <strong>Maximum disc size:</strong>
                    <br />
                    <span className="text-sm">{data.dickSize}</span>
                  </p>
                  <p>
                    <strong>Press brake:</strong>
                    <br />
                    <span className="text-sm">{data.pressBreak}</span>
                  </p>
                  <p>
                    <strong>Materials:</strong>
                    <br />
                    <span className="text-sm">{data.materials}</span>
                  </p>
                  <p>
                    <strong>Products:</strong>
                    <br />
                    <span className="text-sm">{data.products}</span>
                  </p>
                </div>
              </div>
              <Image
                className="my-2 h-[500px] rounded-lg lg:z-10 lg:col-span-4 lg:my-20 lg:rounded-lg"
                height={1100}
                width={1100}
                priority
                src={images[selectedImage]}
                alt="Engineering Images"
              />
            </article>
          </section>
        </div>
        <div className="space-y-4">
          {/* Main Image */}
          <div className="overflow-hiddend relative">
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`relative h-24 w-24 overflow-hidden rounded-lg shadow-sm ${
                    selectedImage === index ? "ring-4 ring-primary/50" : "ring-1 ring-gray-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    height={96}
                    width={96}
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Article;
