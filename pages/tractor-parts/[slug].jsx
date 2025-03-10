import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";
// import { Check, X } from "lucide-react";
// import { convertToReadableDate } from "@/utils";

const PartDetails = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);

  const getPartDetails = async () => {
    try {
      const url = `/parts/${router.query.slug}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = transformMedia(res.data);

        delete response.updatedAt;
        delete response.createdAt;
        if (!Array.isArray(response?.media)) {
          response.media = [response?.media];
        }
        response.description = response.description.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        setSelectedImage(0);
        setData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  useEffect(() => {
    if (router.query.slug) getPartDetails();
  }, [router.query.slug]);
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                            className={`relative h-20 w-20 overflow-hidden rounded-lg shadow-sm md:h-24 md:w-24 ${
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
                              classes="object-contain"
                            />
                          </button>
                        );
                      }
                    })}
                  </div>
                ) : null}
              </div>
              {/* Part Details Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="break-all text-2xl font-bold capitalize">{data?.name}</h1>
                </div>

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
                    <td className="w-1/3 text-wrap text-base font-bold capitalize lg:text-lg">
                      OEM Numbers:
                    </td>
                    <td>
                      {data?.oem_number.split(",").map((item, index) => (
                        <p className="text-base lg:text-lg" key={index}>
                          {item}
                        </p>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/3 text-wrap text-base font-bold capitalize lg:text-lg">
                      Material:
                    </td>
                    <td className="text-base lg:text-lg">{data?.material}</td>
                  </tr>
                  <tr>
                    <td className="w-1/3 text-wrap text-base font-bold capitalize lg:text-lg">
                      Weight:
                    </td>
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
};

export default PartDetails;
