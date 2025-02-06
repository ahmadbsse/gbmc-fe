import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BaseImage, BaseLoader, BaseVideo, Navbar } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { transformHeroVideo, transformMedia } from "@/utils";
import type { EngineeringComponent } from "@/types";
import Link from "next/link";
import { appData } from "@/constants";

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
        setData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  useEffect(() => {
    if (router.query.slug) getComponentDetails();
  }, [router.query.slug]);
  const breadcrumbs = [
    { text: "Home", href: "/" },
    { text: "Engineering", href: "/engineering" },
    { text: data?.name, href: `/engineering/${router.query.slug}` },
  ];
  return (
    <>
      <Head>
        <title>
          Article - {data?.name} | {appData.name}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      {data ? (
        <div className="mx-auto max-w-7xl">
          <div className="my-4 px-2">
            <div className="mb-2 flex items-center gap-2 text-sm text-black">
              {breadcrumbs.map((crumb, index) => (
                <p key={index}>
                  <Link href={crumb.href} className="pr-2 hover:text-secondary">
                    {crumb.text}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-2 px-2 lg:px-16">
            <div className="relative">
              {data.hero_image.type && data.hero_image.type == "video" ? (
                <BaseVideo src={data.hero_image.url} autoPlay={true} muted={true} loop={true} />
              ) : (
                <BaseImage
                  width={data.hero_image.formats.large.width}
                  height={data.hero_image.formats.large.height}
                  src={data.hero_image.formats.large.url}
                  alt={data.hero_image.name}
                  classes="w-full max-h-[645px] rounded-lg"
                />
              )}
              <p className="absolute bottom-5 left-7 text-xl font-semibold text-white lg:bottom-0 lg:left-20 lg:top-20 lg:text-4xl">
                {data?.name}
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pt-4 lg:py-8">
            <div className="container">
              <h2 className="pb-3 font-semibold lg:text-2xl">Summary</h2>

              <p
                className="text-sm lg:text-base"
                dangerouslySetInnerHTML={{ __html: data.summary }}
              ></p>

              <section id="projects" className="pt-5 lg:py-8">
                <article className="reverse grid grid-cols-1 md:grid-cols-10">
                  <div className="card-details rounded-lg bg-[#707070] p-4 text-sm text-white lg:text-base">
                    <div className="flex flex-col gap-2 py-7 lg:w-[400px] lg:gap-5 lg:px-11">
                      <h2 className="text-xl font-bold lg:text-2xl">Description</h2>
                      <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                    </div>
                  </div>
                  <BaseImage
                    classes="my-2 h-[500px] rounded-lg lg:z-10 lg:col-span-4 lg:my-20 lg:rounded-lg"
                    height={1100}
                    width={1100}
                    src={data?.media[selectedImage].formats.actual.url}
                    alt="Engineering Images"
                  />
                </article>
              </section>
            </div>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="overflow-hiddend relative">
                {/* Thumbnail Images */}
                <div className="flex gap-4">
                  {data?.media?.map((img, index) => (
                    <button
                      key={index}
                      className={`relative h-24 w-24 overflow-hidden rounded-lg shadow-sm ${
                        selectedImage === index ? "ring-4 ring-primary/50" : "ring-1 ring-gray-200"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <BaseImage
                        height={96}
                        width={96}
                        src={img.formats.thumbnail.url}
                        alt={`Product view ${index + 1}`}
                        classes="h-full w-full object-cover"
                      />
                    </button>
                  ))}
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
