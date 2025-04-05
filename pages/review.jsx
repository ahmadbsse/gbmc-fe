import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";

export default function ReviewDetails() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setData({
      id: 37,
      documentId: "le0crsuplj4awoui0wg4ct2j",
      name: "test new",
      oem_number: "555, 000",
      material: "mixed wooden",
      weight: "1kg",
      description: "",
      active: true,
      featured: true,
      number: "30",
      media: [
        {
          type: "image",
          id: 650,
          documentId: "kyy9ykbkrim7nokbc2mamhsi",
          name: "3.jpeg",
          createdAt: "2025-03-12T19:28:08.838Z",
          formats: {
            small: {
              url: "/uploads/small_12_2933937d80.jpeg",
              width: 500,
              height: 500,
            },
            thumbnail: {
              url: "/uploads/thumbnail_12_2933937d80.jpeg",
              width: 156,
              height: 156,
            },
            actual: {
              url: "/uploads/12_bb3e96c0fe.jpeg",
              width: 400,
              height: 400,
            },
          },
        },
      ],
      supplier: {
        documentId: "aykuydpxmuzq49a53eywstuy",
        name: "Ford",
        description: "Ford test",
        active: true,
        createdAt: "2025-03-23T21:48:32.501Z",
        updatedAt: "2025-03-23T21:48:32.501Z",
        publishedAt: "2025-03-23T21:48:32.541Z",
      },
    });
  }, []);
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: "Tractor Parts", href: "/tractor-parts" },
    { text: data?.name, href: `/tractor-parts/${router.query.slug}` },
  ];

  return (
    <>
      <SeoHead title={data && data?.name ? data?.name : "Part Details"} />
      <Navbar setTab={() => {}} />
      <PageLayout title="" breadcrumbs={breadcrumbs} isDetailsPage={true}>
        {data ? (
          <div className="px-2">
            <div className="mb-6">
              <h1 className="break-all text-2xl font-bold">{data?.name}</h1>
            </div>
            <div className="">
              {/* Part Images Section */}
              <div className="relative space-y-4">
                <ImageMagnifier image={data?.media[selectedImage]} title={data?.name} />

                {/* Thumbnail Images */}
                {data?.media && data?.media?.length > 1 ? (
                  <div className="flex flex-wrap gap-4">
                    {data?.media.map((img, index) => {
                      if (img && img?.formats && img?.formats.thumbnail) {
                        return (
                          <button
                            key={index}
                            className={`relative h-20 w-20 overflow-hidden rounded-lg p-1 shadow-sm md:h-24 md:w-24 ${
                              selectedImage === index
                                ? "ring-4 ring-primary/50"
                                : "ring-1 ring-gray-200"
                            }`}
                            onClick={() => setSelectedImage(index)}
                          >
                            <BaseImage
                              height={img?.formats?.thumbnail?.height}
                              width={img?.formats?.thumbnail?.width}
                              src={img.formats.thumbnail.url}
                              alt={`Part view ${index + 1}`}
                              classes="object-contain max-h-20 p-1"
                            />
                          </button>
                        );
                      }
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            {/* Part Details Section */}
            <div className="my-6">
              <div ref={contentRef}>
                <p
                  className="min-h-10 text-lg"
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                ></p>
              </div>
            </div>
            <div className="mt-8 max-w-3xl">
              <h2 className="mb-3 text-xl font-bold">Specifications</h2>
              <table className="product-specification-table product-specification-table-striped">
                <tbody>
                  <tr>
                    <td className="w-1/3 text-wrap text-base font-bold lg:text-lg">OEM Numbers:</td>
                    <td>
                      {data?.oem_number.split(",").map((item, index) => (
                        <p className="text-base lg:text-lg" key={index}>
                          {item}
                        </p>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/3 text-wrap text-base font-bold lg:text-lg">Material:</td>
                    <td className="text-base lg:text-lg">{data?.material}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 text-wrap text-base font-bold lg:text-lg">Weight:</td>
                    <td className="text-base lg:text-lg">{data?.weight}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mx-auto w-fit">
            <BaseLoader />
          </p>
        )}
      </PageLayout>
    </>
  );
}
