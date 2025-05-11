import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BaseImage, BaseLoader, BaseVideo, Navbar, SeoHead } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformHeroVideo, transformMedia, decodeText } from "@/utils";
import type { EngineeringComponent } from "@/types";
import Link from "next/link";
import useMarqueeStateStore from "@/stores/marquee";

const Article = () => {
  const { hasMarquee } = useMarqueeStateStore();
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
        if (response.description) {
          response.description = response.description.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          );
        }
        response.name = decodeText(response.name);
        response.material = decodeText(response.material);
        response.weight = decodeText(response.weight);
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
        <div className={`mx-auto mb-8 max-w-7xl px-4 pt-20 ${hasMarquee ? "pt-32" : "pt-20"}`}>
          <div className="my-4">
            <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <p
                  className={`text-nowrap ${index == 2 ? "max-w-[100px] truncate md:max-w-[200px]" : ""}`}
                  key={index}
                >
                  <Link href={crumb?.href} className="pr-2 hover:text-secondary">
                    {crumb?.text}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </p>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-2 flex h-[190px] w-full max-w-7xl items-center justify-center rounded-lg bg-[rgb(175,185,215)] p-1 shadow-lg sm:h-[350px] lg:h-[645px] lg:px-16">
            {data?.hero_image ? (
              data?.hero_image?.type === "video" ? (
                <BaseVideo src={data?.hero_image?.url} autoPlay={true} muted={false} loop={true} />
              ) : data?.hero_image?.formats?.thumbnail ? (
                <BaseImage
                  width={data?.hero_image?.width || data?.hero_image?.formats?.medium?.width}
                  height={data?.hero_image?.height || data?.hero_image?.formats?.medium?.height}
                  src={data?.hero_image?.url || data?.hero_image?.formats?.medium?.url}
                  alt={data?.hero_image?.name}
                  classes="object-contain lg:max-h-[645px] p-1 sm:max-h-[350px] max-h-[190px] rounded-lg"
                  priority={true}
                />
              ) : null
            ) : null}
          </div>
          <div className="mx-auto max-w-7xl pt-4 lg:py-8">
            <div className="lg:container">
              <p className="break-all text-2xl font-bold lg:bottom-0 lg:left-20 lg:top-20">
                {data?.name}
              </p>
              <p
                className="mt-5 min-h-10 text-lg"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />

              <div className="mb-3 mt-4 flex flex-col gap-4 lg:flex-row lg:gap-10">
                <div className="rounded-lg bg-[rgb(175,164,164)] p-4 text-sm text-white lg:h-[470px] lg:w-[700px] lg:text-base">
                  <div className="lg:w-[750px] lg:gap-5 lg:px-11 lg:py-7">
                    <div className="flex flex-col gap-2 lg:w-[500px]">
                      <p className="text-2xl font-bold">Key Features</p>
                      <p>
                        <span className="text-base font-bold lg:text-lg">Weight:</span>
                        <br />

                        {data?.weight ? (
                          <span className="text-base lg:text-lg">{data?.weight}</span>
                        ) : null}
                      </p>
                      <p>
                        <span className="text-base font-bold lg:text-lg">Material:</span>
                        <br />
                        {data.material ? (
                          <span className="text-base lg:text-lg">{data.material}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="z-20 flex h-[200px] w-full items-center justify-center rounded-lg bg-white p-6 text-white shadow-lg md:h-auto md:max-h-[300px] lg:my-8 lg:-ml-32 lg:max-h-[400px]">
                  {data?.media && data?.media[selectedImage] ? (
                    <div className="m-1 h-[100px] p-1 text-black md:h-auto md:max-h-[300px] lg:max-h-[400px]">
                      <BaseImage
                        classes="object-contain rounded-lg p-1 lg:max-h-[390px] md:max-h-[290px] h-[90px] md:h-auto"
                        height={data?.media[selectedImage]?.formats?.actual?.height}
                        width={data?.media[selectedImage]?.formats?.actual?.width}
                        src={data?.media[selectedImage]?.formats?.actual?.url}
                        alt="Engineering Images"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="overflow-hiddend relative">
                {/* Thumbnail Images */}
                <div className="flex flex-wrap gap-4">
                  {data?.media ? (
                    data?.media.length > 1 &&
                    data?.media?.map((img, index) => {
                      if (img && img.formats) {
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
                              height={img?.formats?.thumbnail?.height || 96}
                              width={img?.formats?.thumbnail?.width || 96}
                              src={img?.formats?.thumbnail?.url}
                              alt={`Product view ${index + 1}`}
                              classes="object-contain max-h-20 p-1"
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
