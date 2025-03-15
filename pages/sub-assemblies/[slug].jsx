import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia, decodeText } from "@/utils";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { ImageMagnifier } from "@/components/user";

const SubAssemblyDetails = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

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
        response.name = decodeText(response.name);
        response.weight = decodeText(response.weight);
        response.oem_number = decodeText(response.oem_number);
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

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Get the scroll height (full content height) and client height (visible height)
        const isContentOverflowing =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsOverflowing(isContentOverflowing);
      }
    };

    // Check initially
    checkOverflow();

    // Check on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [data?.description]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <SeoHead title={data && data?.name ? data?.name : "Sub Assembly Details"} />
      <Navbar setTab={() => {}} />
      <PageLayout title="" breadcrumbs={breadcrumbs} isDetailsPage={true}>
        {data ? (
          <div className="px-2">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Sub Assembly Images Section */}
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
                              alt={`Sub Assembly view ${index + 1}`}
                              classes="object-contain max-h-20 p-1"
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
                  <h1 className="break-all text-2xl font-bold">{data?.name}</h1>
                </div>
                <div
                  ref={contentRef}
                  className={`relative ${expanded ? "" : "h-auto overflow-y-auto sm:h-[170px] md:overflow-y-hidden lg:h-[310px]"}`}
                >
                  <p
                    className="min-h-10 text-lg"
                    dangerouslySetInnerHTML={{ __html: data?.description }}
                  ></p>
                  {isOverflowing && (
                    <div
                      className={`hidden w-fit md:block ${expanded ? "" : "absolute bottom-0 right-1.5 bg-gradient-to-t from-white to-transparent"}`}
                    >
                      <button
                        onClick={toggleExpand}
                        className="text-blac rounded-md bg-gray-50 py-1 pr-4 underline"
                      >
                        {expanded ? "" : "...See More"}
                      </button>
                    </div>
                  )}
                </div>
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
};

export default SubAssemblyDetails;
