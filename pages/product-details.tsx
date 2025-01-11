import React, { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import Head from "next/head";

import { PageLayout } from "@/components/user";
import { Navbar } from "@/components/common";

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, boundedX: 0, boundedY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const images = [
    "/assets/dummy_1.webp",
    "/assets/dummy_2.webp",
    "/assets/dummy_3.webp",
    "/assets/dummy_4.webp",
  ];

  // Size of the magnifier square
  const magnifierSize = 60;
  // Zoom level
  const zoomLevel = 3.5;

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();

    // Calculate cursor position relative to the image
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    // Ensure the magnifier square stays within the image bounds
    const magnifierX = Math.max(magnifierSize / 2, Math.min(x, bounds.width - magnifierSize / 2));
    const magnifierY = Math.max(magnifierSize / 2, Math.min(y, bounds.height - magnifierSize / 2));

    setMousePosition({
      x: magnifierX,
      y: magnifierY,
      boundedX: (magnifierX / bounds.width) * 100,
      boundedY: (magnifierY / bounds.height) * 100,
    });
  };
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: "Tractor Parts", href: "/tractor-parts" },
    { text: "Product Details", href: "product-details" },
  ];

  const specifications = {
    product_code: "12DT8A5FD",
    SKU: "A5SWH43ATBGU2",
    model: "5075E",
    manufacturer: "John Deere",
    rating: 4.5,
    weight: "5710kg",
    material: "Aluminium",
    alternative_part_number: ["111111", "44444", "55555"],
  };
  const replaceSpecialCharacterWithSpaced = (key: string): string => {
    return key.replace(/[^a-zA-Z0-9\s]/g, " ");
  };
  return (
    <>
      <Head>
        <title>Product Details</title>
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
      <Navbar />
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <PageLayout title="Product Details" breadcrumbs={breadcrumbs}>
            <div className="px-2">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Product Images Section */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <div className="absolute right-4 top-4 z-10">
                      <span className="rounded-full bg-primary px-4 py-2 text-white">30% OFF</span>
                    </div>
                    <div
                      className="relative w-full cursor-crosshair lg:h-[400px]"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <Image
                        height={400}
                        width={800}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        src={images[selectedImage]}
                        alt="Product Main View"
                        className="h-[350px] w-full object-cover lg:h-[500px]"
                        priority
                      />
                      {isHovering && (
                        <>
                          {/* Magnifier Square */}
                          <div
                            className="pointer-events-none absolute hidden border-2 border-primary/50 bg-white bg-opacity-10 xl:block"
                            style={{
                              width: `${magnifierSize}px`,
                              height: `${magnifierSize}px`,
                              top: mousePosition.y,
                              left: mousePosition.x,
                              transform: "translate(-50%, -50%)",
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                    {/* Zoomed Image Container */}
                  </div>
                  {isHovering ? (
                    <div className="absolute left-1/2 right-1/2 top-40 z-20 ml-4 hidden h-[200px] w-[200px] overflow-hidden border border-gray-200 xl:block">
                      <div
                        className="relative h-full w-full"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: `${mousePosition.boundedX}% ${mousePosition.boundedY}%`,
                        }}
                      >
                        <Image
                          fill
                          src={images[selectedImage]}
                          alt="Zoomed view"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                          quality={100}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Thumbnail Images */}
                  <div className="flex gap-4">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        className={`relative h-24 w-24 overflow-hidden rounded-lg shadow-sm ${
                          selectedImage === index
                            ? "ring-4 ring-primary/50"
                            : "ring-1 ring-gray-200"
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

                {/* Product Details Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm lg:text-base">
                      PRODUCT CODE: {specifications.product_code}
                    </p>

                    <h1 className="text-xl font-bold text-primary lg:text-3xl">
                      Engine Head Cover- Genuine
                    </h1>

                    <span className="text-xs italic">SKU: {specifications.SKU}</span>

                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-fill-primary/40 fill-secondary" size={16} />
                      ))}
                      <span className="">({specifications.rating} reviews)</span>
                    </div>
                  </div>

                  <p className="">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
              <div className="mt-8 max-w-3xl">
                <h2 className="mb-3 font-semibold lg:text-xl">Specifications</h2>
                <table className="product-specification-table product-specification-table-striped">
                  <tbody>
                    {Object.keys(specifications).map((key, index) => {
                      const value = (
                        specifications as unknown as Record<
                          string,
                          number | [] | string | undefined
                        >
                      )[key];
                      return (
                        <tr key={index}>
                          <td className="capitalize">{replaceSpecialCharacterWithSpaced(key)}:</td>
                          <td>{Array.isArray(value) ? value.join(", ") : value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </PageLayout>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
