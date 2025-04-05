import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";
import { transformMedia } from "@/utils";

export default function ReviewDetails() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const data = {
      id: 37,
      documentId: "le0crsuplj4awoui0wg4ct2j",
      name: "test new",
      oem_number: "555, 000",
      material: "mixed wooden",
      weight: "1kg",
      description: `<p>So, let’s suppose that you have done some brainstorming to develop your thesis. What else should you keep in mind as you begin to create paragraphs.</p>`,
      active: true,
      featured: true,
      number: "30",
      createdAt: "2025-03-30T11:43:56.287Z",
      updatedAt: "2025-03-30T11:43:56.287Z",
      publishedAt: "2025-03-30T11:43:56.304Z",
      media: [
        {
          id: 36,
          documentId: "av6vv5qyycqepac2eh80mg5r",
          name: "12.jpeg",
          alternativeText: null,
          caption: null,
          width: 1280,
          height: 854,
          formats: {
            large: {
              ext: ".jpeg",
              url: "/uploads/large_12_2933937d80.jpeg",
              hash: "large_12_2933937d80",
              mime: "image/jpeg",
              name: "large_12.jpeg",
              path: null,
              size: 51.66,
              width: 1000,
              height: 667,
              sizeInBytes: 51663,
            },
            small: {
              ext: ".jpeg",
              url: "/uploads/small_12_2933937d80.jpeg",
              hash: "small_12_2933937d80",
              mime: "image/jpeg",
              name: "small_12.jpeg",
              path: null,
              size: 15.13,
              width: 500,
              height: 334,
              sizeInBytes: 15132,
            },
            medium: {
              ext: ".jpeg",
              url: "/uploads/medium_12_2933937d80.jpeg",
              hash: "medium_12_2933937d80",
              mime: "image/jpeg",
              name: "medium_12.jpeg",
              path: null,
              size: 30.62,
              width: 750,
              height: 500,
              sizeInBytes: 30617,
            },
            thumbnail: {
              ext: ".jpeg",
              url: "/uploads/thumbnail_12_2933937d80.jpeg",
              hash: "thumbnail_12_2933937d80",
              mime: "image/jpeg",
              name: "thumbnail_12.jpeg",
              path: null,
              size: 4.76,
              width: 234,
              height: 156,
              sizeInBytes: 4759,
            },
          },
          hash: "12_2933937d80",
          ext: ".jpeg",
          mime: "image/jpeg",
          size: 79.94,
          url: "/uploads/12_2933937d80.jpeg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2025-03-30T11:43:55.909Z",
          updatedAt: "2025-03-30T11:43:55.909Z",
          publishedAt: "2025-03-30T11:43:55.909Z",
        },
        {
          id: 35,
          documentId: "mezqrcmj39y63htdyhdq7i7i",
          name: "19.jpeg",
          alternativeText: null,
          caption: null,
          width: 1280,
          height: 854,
          formats: {
            large: {
              ext: ".jpeg",
              url: "/uploads/large_19_3cafd97d4d.jpeg",
              hash: "large_19_3cafd97d4d",
              mime: "image/jpeg",
              name: "large_19.jpeg",
              path: null,
              size: 12.3,
              width: 1000,
              height: 667,
              sizeInBytes: 12295,
            },
            small: {
              ext: ".jpeg",
              url: "/uploads/small_19_3cafd97d4d.jpeg",
              hash: "small_19_3cafd97d4d",
              mime: "image/jpeg",
              name: "small_19.jpeg",
              path: null,
              size: 4.41,
              width: 500,
              height: 334,
              sizeInBytes: 4410,
            },
            medium: {
              ext: ".jpeg",
              url: "/uploads/medium_19_3cafd97d4d.jpeg",
              hash: "medium_19_3cafd97d4d",
              mime: "image/jpeg",
              name: "medium_19.jpeg",
              path: null,
              size: 7.88,
              width: 750,
              height: 500,
              sizeInBytes: 7883,
            },
            thumbnail: {
              ext: ".jpeg",
              url: "/uploads/thumbnail_19_3cafd97d4d.jpeg",
              hash: "thumbnail_19_3cafd97d4d",
              mime: "image/jpeg",
              name: "thumbnail_19.jpeg",
              path: null,
              size: 1.7,
              width: 234,
              height: 156,
              sizeInBytes: 1698,
            },
          },
          hash: "19_3cafd97d4d",
          ext: ".jpeg",
          mime: "image/jpeg",
          size: 17.71,
          url: "/uploads/19_3cafd97d4d.jpeg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2025-03-30T11:43:55.890Z",
          updatedAt: "2025-03-30T11:43:55.890Z",
          publishedAt: "2025-03-30T11:43:55.892Z",
        },
        {
          id: 34,
          documentId: "g6rn90jj0rxqhoncbigtfzyj",
          name: "12.jpeg",
          alternativeText: null,
          caption: null,
          width: 1280,
          height: 854,
          formats: {
            large: {
              ext: ".jpeg",
              url: "/uploads/large_12_bb3e96c0fe.jpeg",
              hash: "large_12_bb3e96c0fe",
              mime: "image/jpeg",
              name: "large_12.jpeg",
              path: null,
              size: 51.66,
              width: 1000,
              height: 667,
              sizeInBytes: 51663,
            },
            small: {
              ext: ".jpeg",
              url: "/uploads/small_12_bb3e96c0fe.jpeg",
              hash: "small_12_bb3e96c0fe",
              mime: "image/jpeg",
              name: "small_12.jpeg",
              path: null,
              size: 15.13,
              width: 500,
              height: 334,
              sizeInBytes: 15132,
            },
            medium: {
              ext: ".jpeg",
              url: "/uploads/medium_12_bb3e96c0fe.jpeg",
              hash: "medium_12_bb3e96c0fe",
              mime: "image/jpeg",
              name: "medium_12.jpeg",
              path: null,
              size: 30.62,
              width: 750,
              height: 500,
              sizeInBytes: 30617,
            },
            thumbnail: {
              ext: ".jpeg",
              url: "/uploads/thumbnail_12_bb3e96c0fe.jpeg",
              hash: "thumbnail_12_bb3e96c0fe",
              mime: "image/jpeg",
              name: "thumbnail_12.jpeg",
              path: null,
              size: 4.76,
              width: 234,
              height: 156,
              sizeInBytes: 4759,
            },
          },
          hash: "12_bb3e96c0fe",
          ext: ".jpeg",
          mime: "image/jpeg",
          size: 79.94,
          url: "/uploads/12_bb3e96c0fe.jpeg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2025-03-30T11:43:55.831Z",
          updatedAt: "2025-03-30T11:43:55.831Z",
          publishedAt: "2025-03-30T11:43:55.833Z",
        },
        {
          id: 37,
          documentId: "uxf7zihrdsc01bs20ec7e8x9",
          name: "29.jpeg",
          alternativeText: null,
          caption: null,
          width: 1280,
          height: 854,
          formats: {
            large: {
              ext: ".jpeg",
              url: "/uploads/large_29_5ec4054069.jpeg",
              hash: "large_29_5ec4054069",
              mime: "image/jpeg",
              name: "large_29.jpeg",
              path: null,
              size: 48.19,
              width: 1000,
              height: 667,
              sizeInBytes: 48194,
            },
            small: {
              ext: ".jpeg",
              url: "/uploads/small_29_5ec4054069.jpeg",
              hash: "small_29_5ec4054069",
              mime: "image/jpeg",
              name: "small_29.jpeg",
              path: null,
              size: 16.89,
              width: 500,
              height: 334,
              sizeInBytes: 16893,
            },
            medium: {
              ext: ".jpeg",
              url: "/uploads/medium_29_5ec4054069.jpeg",
              hash: "medium_29_5ec4054069",
              mime: "image/jpeg",
              name: "medium_29.jpeg",
              path: null,
              size: 31.1,
              width: 750,
              height: 500,
              sizeInBytes: 31095,
            },
            thumbnail: {
              ext: ".jpeg",
              url: "/uploads/thumbnail_29_5ec4054069.jpeg",
              hash: "thumbnail_29_5ec4054069",
              mime: "image/jpeg",
              name: "thumbnail_29.jpeg",
              path: null,
              size: 5.69,
              width: 234,
              height: 156,
              sizeInBytes: 5688,
            },
          },
          hash: "29_5ec4054069",
          ext: ".jpeg",
          mime: "image/jpeg",
          size: 67.85,
          url: "/uploads/29_5ec4054069.jpeg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2025-03-30T11:43:55.987Z",
          updatedAt: "2025-03-30T11:43:55.987Z",
          publishedAt: "2025-03-30T11:43:55.987Z",
        },
      ],
      supplier: {
        id: 2,
        documentId: "aykuydpxmuzq49a53eywstuy",
        name: "Ford",
        description: "Ford test",
        active: true,
        createdAt: "2025-03-23T21:48:32.501Z",
        updatedAt: "2025-03-23T21:48:32.501Z",
        publishedAt: "2025-03-23T21:48:32.541Z",
      },
    };
    setData(transformMedia(data));
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
