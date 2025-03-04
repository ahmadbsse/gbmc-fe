import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BaseImage, BaseLoader, BaseVideo, Navbar, SeoHead } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformHeroVideo, transformMedia } from "@/utils";
import type { EngineeringComponent } from "@/types";
import Link from "next/link";

const Article = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [data, setData] = useState<EngineeringComponent | null>(null);

  const getComponentDetails = async () => {
    try {
      const url = `/engineering-components/${router.query.slug}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = transformMedia(res.data);
        delete response.id;
        delete response.updatedAt;
        delete response.createdAt;
        delete response.publishedAt;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        if (response.hero_image.mime?.includes("video")) {
          response.hero_image = transformHeroVideo(response.hero_image);
        } else {
          response.hero_image = transformMedia([response.hero_image])[0];
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
    if (router.query.slug) getComponentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: "Engineering Components", href: "/engineering" },
    { text: data?.name, href: `/engineering/${router.query.slug}` },
  ];

  return (
    <>
      <SeoHead title={`${data?.name}`} />
      <Navbar setTab={() => {}} />
      {data ? (
        <div className="mx-auto mb-8 max-w-7xl px-2 pt-20">
          <div className="my-4">
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <p key={index}>
                  <Link href={crumb?.href} className="pr-2 hover:text-secondary">
                    {crumb?.text}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </p>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-2 flex h-[645px] w-full max-w-7xl items-center justify-center rounded-lg bg-white shadow-lg lg:px-16">
            {data?.hero_image ? (
              data?.hero_image?.type === "video" ? (
                <BaseVideo src={data?.hero_image?.url} autoPlay={true} muted={true} loop={true} />
              ) : data?.hero_image?.formats?.thumbnail ? (
                <BaseImage
                  width={data?.hero_image?.width || data?.hero_image?.formats?.medium?.width}
                  height={data?.hero_image?.height || data?.hero_image?.formats?.medium?.height}
                  src={data?.hero_image?.url || data?.hero_image?.formats?.medium?.url}
                  alt={data?.hero_image?.name}
                  classes="object-contain max-h-[645px] rounded-lg"
                />
              ) : null
            ) : null}
          </div>
          <div className="mx-auto max-w-7xl px-4 pt-4 lg:py-8">
            <div className="container">
              <p className="text-xl font-semibold lg:bottom-0 lg:left-20 lg:top-20 lg:text-2xl">
                {data?.name}
              </p>
              <p
                className="mt-5 min-h-10 text-lg"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />

              <div className="mb-3 mt-4 flex flex-col gap-3 lg:flex-row lg:gap-10">
                <div className="rounded-lg bg-[#707070] p-4 text-sm text-white lg:h-[650px] lg:w-[700px] lg:text-base">
                  <div className="flex flex-col gap-2 py-7 lg:w-[700px] lg:gap-5 lg:px-11">
                    <h2 className="text-lg font-bold lg:text-2xl">Key Features</h2>
                    <p>
                      <strong>Weight:</strong>
                      <br />
                      {data?.weight ? <span>{data?.weight}</span> : null}
                    </p>
                    <p>
                      <strong>Material:</strong>
                      <br />
                      {data.material ? <span>{data.material}</span> : null}
                    </p>
                  </div>
                </div>

                <div className="z-20 flex h-[500px] w-full items-center justify-center rounded-lg bg-white p-6 text-white shadow-lg lg:my-20 lg:-ml-32">
                  {data?.media && data?.media[selectedImage] ? (
                    <BaseImage
                      classes="object-contain rounded-lg max-h-[500px] "
                      height={data?.media[selectedImage]?.formats?.actual?.height}
                      width={data?.media[selectedImage]?.formats?.actual?.width}
                      src={data?.media[selectedImage]?.formats?.actual?.url}
                      alt="Engineering Images"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="overflow-hiddend relative">
                {/* Thumbnail Images */}
                <div className="flex gap-4">
                  {data?.media ? (
                    data?.media.length > 1 &&
                    data?.media?.map((img, index) => {
                      if (img && img.formats) {
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
                              height={96}
                              width={96}
                              src={img?.formats?.thumbnail?.url}
                              alt={`Product view ${index + 1}`}
                              classes="h-full w-full object-contain"
                            />
                          </button>
                        );
                      }
                    })
                  ) : (
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg shadow-sm"> </div>
                  )}
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      ) : (
        <div className="mx-auto w-fit">
          <BaseLoader />
        </div>
      )}
    </>
  );
};
export default Article;
