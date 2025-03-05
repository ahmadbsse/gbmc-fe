import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
// import { Check, X } from "lucide-react";
// import { convertToReadableDate } from "@/utils";

const SubAssemblyDetails = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, boundedX: 0, boundedY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  // Size of the magnifier square
  const magnifierSize = 60;
  // Zoom level
  const zoomLevel = 2;

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseMove = (e) => {
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
              <div className="space-y-4">
                {/* Main Image */}
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="relative flex w-full cursor-crosshair items-center justify-center lg:h-[400px]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    {data?.media[selectedImage] &&
                    data?.media[selectedImage]?.formats &&
                    data?.media[selectedImage]?.formats?.actual ? (
                      <BaseImage
                        height={data?.media[selectedImage]?.formats?.actual?.height}
                        width={data?.media[selectedImage]?.formats?.actual?.width}
                        src={data?.media[selectedImage].formats?.actual?.url}
                        alt={data?.name}
                        classes="object-contain w-fit m-auto"
                        priority={true}
                      />
                    ) : null}
                    {isHovering && (
                      <>
                        {/* Magnifier Square */}
                        <div
                          className="pointer-events-none absolute hidden border-2 border-primary/50 bg-white bg-opacity-10 sm:block"
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
                  <div className="absolute left-1/2 right-1/2 top-40 z-20 ml-4 hidden h-[200px] w-[200px] overflow-hidden border border-gray-200 sm:block">
                    <div
                      className="relative h-full w-full bg-white"
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: `${mousePosition.boundedX}% ${mousePosition.boundedY}%`,
                      }}
                    >
                      {data?.media &&
                      data?.media[selectedImage]?.formats &&
                      data?.media[selectedImage]?.formats?.actual ? (
                        <BaseImage
                          src={data?.media[selectedImage]?.formats?.actual?.url}
                          alt={data?.name + "zoomed-view"}
                          classes="object-cover"
                          fill={true}
                        />
                      ) : (
                        <div>a</div>
                      )}
                    </div>
                  </div>
                ) : null}

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
