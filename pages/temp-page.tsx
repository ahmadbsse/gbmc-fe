import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";

export default function TempPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setData({
      id: 181,
      documentId: "hbfld5lsi9hll68i00trpdjl",
      name: "jkas;djalskjdlajsdlkja;s",
      number: "890",
      material: "Cody's Terry>\\\\//",
      weight: "Cody's Terry>\\\\//",
      description: "<p>Quisquam quis iste c.jkasdjasd</p>",
      publishedAt: "2025-03-14T14:59:04.131Z",
      active: true,
      featured: true,
      oem_number: "Cody's Terry>\\\\//",
      media: [
        {
          type: "image",
          id: 650,
          documentId: "kyy9ykbkrim7nokbc2mamhsi",
          name: "3.jpeg",
          createdAt: "2025-03-12T19:28:08.838Z",
          formats: {
            small: {
              width: 500,
              height: 500,
            },
            thumbnail: {
              url: "/uploads/thumbnail_3_bd7f5092ef.jpeg",
              width: 156,
              height: 156,
            },
            actual: {
              url: "/uploads/3_bd7f5092ef.jpeg",
              width: 400,
              height: 400,
            },
          },
        },
        {
          type: "image",
          id: 651,
          documentId: "ffsshpicgz315ef137x8v6bz",
          name: "1.jpeg",
          createdAt: "2025-03-12T19:28:09.461Z",
          formats: {
            small: {
              url: "/uploads/small_1_19ae060fd4.jpeg",
              width: 334,
              height: 500,
            },
            thumbnail: {
              url: "/uploads/thumbnail_1_19ae060fd4.jpeg",
              width: 104,
              height: 156,
            },
            actual: {
              url: "/uploads/1_19ae060fd4.jpeg",
              width: 854,
              height: 1280,
            },
          },
        },
        {
          type: "image",
          id: 652,
          documentId: "w1cchd2qorh7ibckjnzpylgw",
          name: "4.jpeg",
          createdAt: "2025-03-12T19:28:09.463Z",
          formats: {
            small: {
              url: "/uploads/small_4_fdf6384cbc.jpeg",
              width: 500,
              height: 334,
            },
            thumbnail: {
              url: "/uploads/thumbnail_4_fdf6384cbc.jpeg",
              width: 234,
              height: 156,
            },
            actual: {
              url: "/uploads/4_fdf6384cbc.jpeg",
              width: 1280,
              height: 854,
            },
          },
        },
        {
          type: "image",
          id: 653,
          documentId: "e5f9nd0hekb4ez7pha7x4z5g",
          name: "2.jpeg",
          createdAt: "2025-03-12T19:28:09.496Z",
          formats: {
            small: {
              url: "/uploads/small_2_3518ccae1a.jpeg",
              width: 500,
              height: 334,
            },
            thumbnail: {
              url: "/uploads/thumbnail_2_3518ccae1a.jpeg",
              width: 234,
              height: 156,
            },
            actual: {
              url: "/uploads/2_3518ccae1a.jpeg",
              width: 1280,
              height: 854,
            },
          },
        },
        {
          type: "image",
          id: 661,
          documentId: "zaxy84qv86wrxvien7oa5tmi",
          name: "8.jpeg",
          createdAt: "2025-03-14T14:38:35.222Z",
          formats: {
            small: {
              url: "/uploads/small_8_3805eaefdd.jpeg",
              width: 500,
              height: 334,
            },
            thumbnail: {
              url: "/uploads/thumbnail_8_3805eaefdd.jpeg",
              width: 234,
              height: 156,
            },
            actual: {
              url: "/uploads/8_3805eaefdd.jpeg",
              width: 1280,
              height: 854,
            },
          },
        },
      ],
      supplier: {
        id: 106,
        documentId: "f57u08vh7o85270vpvgeigae",
        name: "abc",
        description: null,
        createdAt: "2025-03-14T14:47:56.176Z",
        updatedAt: "2025-03-14T14:47:59.683Z",
        publishedAt: "2025-03-14T14:47:59.700Z",
        active: true,
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
