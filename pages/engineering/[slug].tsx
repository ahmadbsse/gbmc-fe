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
          response.hero_image = transformMedia(response.hero_image);
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
    { text: "Engineering", href: "/engineering" },
    { text: data?.name, href: `/engineering/${router.query.slug}` },
  ];
  return (
    <>
      <SeoHead title={`Article - ${data?.name}`} />
      <Navbar setTab={() => {}} />
      {data ? (
        <div className="mx-auto mb-8 max-w-7xl pt-20">
          <div className="my-4 px-2">
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
          <div className="mt-2 px-2 lg:px-16">
            <div>
              {data?.hero_image ? (
                data?.hero_image?.type === "video" ? (
                  <BaseVideo src={data?.hero_image?.url} autoPlay={true} muted={true} loop={true} />
                ) : data?.hero_image?.formats?.thumbnail ? (
                  <BaseImage
                    width={data?.hero_image?.formats?.thumbnail?.width || 1100}
                    height={data?.hero_image?.formats?.thumbnail?.height || 645}
                    src={data?.hero_image?.url || data?.hero_image?.formats?.thumbnail?.url}
                    alt={data?.hero_image?.name}
                    classes="w-full max-h-[645px] rounded-lg"
                  />
                ) : (
                  <div className="max-h-[645px] w-full rounded-lg"></div>
                )
              ) : null}
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pt-4 lg:py-8">
            <div className="container">
              <p className="text-xl font-semibold lg:bottom-0 lg:left-20 lg:top-20 lg:text-4xl">
                {data?.name}
              </p>
              <p
                className="mt-5 min-h-10 text-sm lg:text-base"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
              <section id="projects" className="pt-5 lg:py-8">
                <article className="reverse grid grid-cols-1 md:grid-cols-10">
                  <div className="card-details rounded-lg bg-[#707070] p-4 text-sm text-white lg:text-base">
                    <div className="flex flex-col gap-2 py-7 lg:w-[400px] lg:gap-5 lg:px-11">
                      <h2 className="text-xl font-bold lg:text-2xl">Key Features</h2>

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
                  {data?.media && data?.media[selectedImage] ? (
                    <BaseImage
                      classes="my-2 h-[400px] rounded-lg lg:z-10 lg:col-span-4 lg:my-16 lg:rounded-lg"
                      height={1100}
                      width={1100}
                      src={data?.media[selectedImage]?.formats?.actual?.url}
                      alt="Engineering Images"
                    />
                  ) : (
                    <div className="my-2 h-[500px] rounded-lg lg:z-10 lg:col-span-4 lg:my-20 lg:rounded-lg"></div>
                  )}
                </article>
              </section>
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
