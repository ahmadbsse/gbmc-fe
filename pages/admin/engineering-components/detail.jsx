import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import apiClient from "@/utils/apiClient";

import { Navbar, BaseLoader, BaseImage, BaseVideo, SeoHead } from "@/components/common";
import { transformHeroVideo } from "@/utils";

const ViewComponentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);

  const getComponentDetails = async () => {
    try {
      const url = `/engineering-components/${id}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = res.data;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        if (
          response.hero_image &&
          response.hero_image.mime &&
          response.hero_image.mime.includes("video")
        ) {
          response.hero_image = transformHeroVideo(response.hero_image);
        }
        response.summary = response.summary.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        response.description = response.description.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  useEffect(() => {
    if (id) getComponentDetails();
  }, [id]);
  return (
    <>
      <SeoHead title="Admin" />
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <div className="mx-auto max-w-[810px] space-y-3">
              <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">
                Engineering Component - Details - {formData.name || ""}
              </h1>
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                  {formData.name}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Material</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.material}
                  </div>
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium"> Weight</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.weight}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Summary</label>
                <div
                  className="product-description rounded-lg border border-gray-300 px-4 py-2 text-justify"
                  dangerouslySetInnerHTML={{ __html: formData.summary }}
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <div
                  className="product-description rounded-lg border border-gray-300 px-4 py-2 text-justify"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Hero Image</label>
                <div className="h-28 w-44">
                  {formData.hero_image ? (
                    formData.hero_image.type === "video" ? (
                      <BaseVideo
                        src={formData.hero_image.url}
                        autoPlay={true}
                        muted={true}
                        loop={true}
                        classes="object-cover w-full h-full"
                      />
                    ) : (
                      <BaseImage
                        width={formData.hero_image.formats.thumbnail.width}
                        height={formData.hero_image.formats.thumbnail.height}
                        src={formData.hero_image.formats.thumbnail.url}
                        alt={formData.hero_image.name}
                        classes="object-cover w-full h-full"
                      />
                    )
                  ) : null}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Media</label>
                <div className="flex flex-wrap items-center gap-4">
                  {formData.media ? (
                    Array.isArray(formData.media) ? (
                      formData.media.map((item, index) => {
                        if (item) {
                          return (
                            <div className="h-28 w-44" key={index}>
                              <BaseImage
                                key={index}
                                width={item.formats.thumbnail.width}
                                height={item.formats.thumbnail.height}
                                src={item.formats.thumbnail.url}
                                alt={item.name}
                                classes="object-cover w-full h-full"
                              />
                            </div>
                          );
                        }
                      })
                    ) : (
                      <div className="h-28 w-44">
                        <BaseImage
                          width={formData.media.formats.thumbnail.width}
                          height={formData.media.formats.thumbnail.height}
                          src={formData.media.formats.thumbnail.url}
                          alt={formData.name}
                          classes="object-cover w-full h-full"
                        />
                      </div>
                    )
                  ) : (
                    <div className="h-28 w-44"></div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-3">
                <div className="flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    disabled
                    onChange={() => {}}
                    className="rounded border-gray-300 outline-none focus:border-primary"
                  />
                  <label htmlFor="active" className="text-sm">
                    Mark as active
                  </label>
                </div>

                <div className="flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    disabled
                    onChange={() => {}}
                    checked={formData.featured}
                    className="rounded border-gray-300 outline-none focus:border-primary"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <p className="mx-auto w-fit">
              <BaseLoader />
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default ViewComponentDetails;
