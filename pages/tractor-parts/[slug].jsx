import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, PageLayout, BaseImage, BaseLoader, SeoHead } from "@/components/common";
import { Check, X } from "lucide-react";
import { convertToReadableDate } from "@/utils";

const PartDetails = () => {
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
      <PageLayout title="Product Details" breadcrumbs={breadcrumbs}>
        {data ? (
          <div className="px-2">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Product Images Section */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="overflow-hidden rounded-lg shadow-md">
                  <div
                    className="relative w-full cursor-crosshair lg:h-[400px]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <BaseImage
                      height={data?.media[selectedImage]?.formats?.actual?.height}
                      width={data?.media[selectedImage]?.formats?.actual?.width}
                      src={data?.media[selectedImage].formats?.actual?.url}
                      alt={data?.name}
                      classes="h-[350px] w-full object-cover lg:h-[500px]"
                      priority={true}
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
                      {data?.media ? (
                        <BaseImage
                          src={data?.media[selectedImage]?.formats.actual.url}
                          alt={data?.name + "zoomed-view"}
                          classes="object-cover"
                          fill={true}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Thumbnail Images */}
                <div className="flex gap-4">
                  {data?.media ? (
                    data?.media.map((img, index) => (
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
                          height={img?.formats.thumbnail.height}
                          width={img?.formats.thumbnail.width}
                          src={img.formats.thumbnail.url}
                          alt={`Product view ${index + 1}`}
                          classes="h-full w-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="h-24 w-24"></div>
                  )}
                </div>
              </div>
              {/* Product Details Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm lg:text-base">PRODUCT CODE: {data?.id}</p>
                  <h1 className="text-xl font-bold capitalize text-primary lg:text-3xl">
                    {data?.name}
                  </h1>
                  <span className="text-xs italic">Registered Number: {data?.number}</span>
                </div>

                <p className="min-h-10" dangerouslySetInnerHTML={{ __html: data?.description }}></p>
              </div>
            </div>
            <div className="mt-8 max-w-3xl">
              <h2 className="mb-3 font-semibold lg:text-xl">Specifications</h2>
              <table className="product-specification-table product-specification-table-striped">
                <tbody>
                  <tr>
                    <td className="capitalize">Name:</td>
                    <td>{data?.name}</td>
                  </tr>
                  <tr>
                    <td className="capitalize">Registered Number:</td>
                    <td>{data?.number}</td>
                  </tr>
                  <tr>
                    <td className="capitalize">Material:</td>
                    <td>{data?.material}</td>
                  </tr>
                  <tr>
                    <td className="capitalize">Weight:</td>
                    <td>{data?.weight}</td>
                  </tr>
                  <tr>
                    <td className="capitalize">Published at:</td>
                    <td>{convertToReadableDate(data?.publishedAt)}</td>
                  </tr>
                  <tr>
                    <td className="capitalize">Featured:</td>
                    <td>
                      {data?.featured ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-error" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="capitalize">OEM Numbers:</td>
                    <td>
                      {data?.oem_number.split(",").map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </td>
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
