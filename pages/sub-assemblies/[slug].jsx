import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";
// import { Check, X } from "lucide-react";
// import { convertToReadableDate } from "@/utils";

const SubAssemblyDetails = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  // Size of the magnifier square

  const getSubAssemblyDetails = async () => {
    try {
      const url = `/sub-assemblies/${router.query.slug}?populate=*`;
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
    if (router.query.slug) getSubAssemblyDetails();
  }, [router.query.slug]);
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: "TXL (Sub Assemblies)", href: "/sub-assemblies" },
    { text: data?.name, href: `/sub-assemblies/${router.query.slug}` },
  ];

  return (
    <>
      <SeoHead title={data && data?.name ? data?.name : "Sub Assembly Details"} />
      <Navbar setTab={() => {}} />
      <PageLayout title="Sub Assembly Details" breadcrumbs={breadcrumbs}>
        {data ? (
          <div className="px-2">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Sub Assembly Images Section */}
              <div className="relative space-y-4">
                <ImageMagnifier image={data?.media[selectedImage]} title={data?.name} />
                {/* Thumbnail Images */}
                {data?.media && data?.media?.length > 1 ? (
                  <div className="flex gap-4">
                    {data?.media.map((img, index) => {
                      if (img && img?.formats && img?.formats.thumbnail) {
                        return (
                          <button
                            key={index}
                            className={`relative h-24 w-24 overflow-hidden rounded-lg shadow-sm ${
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
                              alt={`Sub Assembly view ${index + 1}`}
                              classes="object-contain"
                            />
                          </button>
                        );
                      }
                    })}
                  </div>
                ) : null}
              </div>
              {/* Sub Assembly Details Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-xl font-medium capitalize text-[#0060AA] lg:text-2xl">
                    {data?.name}
                  </h1>
                </div>

                <p
                  className="min-h-10 text-lg"
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                ></p>
              </div>
            </div>
            <div className="mt-8 max-w-3xl">
              <h2 className="mb-3 text-lg font-semibold lg:text-xl">Specifications</h2>
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

export default SubAssemblyDetails;
