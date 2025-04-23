import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import apiClient from "@/utils/apiClient";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Navbar, BaseLoader, BaseImage, BaseVideo, SeoHead } from "@/components/common";
import { transformHeroVideo, decodeText } from "@/utils";
import useMarqueeStateStore from "@/stores/marquee";

const ViewComponentDetails = () => {
  const { hasMarquee } = useMarqueeStateStore();
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
        response.description = response.description.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        response.name = decodeText(response.name);
        response.material = decodeText(response.material);
        response.weight = decodeText(response.weight);

        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  useEffect(() => {
    if (id) getComponentDetails();
  }, [id]);
  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      router.push("/admin");
    }
  };

  return (
    <>
      <SeoHead title="Admin" />
      <Navbar isAdmin setTab={setTab} activeTab={"Engineering Components"} showMarquee={false} />
      <div className={`min-h-screen bg-[#f3f3f3] ${hasMarquee ? "mt-28" : "mt-20"}`}>
        <main className="mx-auto px-4 py-8 sm:container">
          {formData ? (
            <div className="mx-auto max-w-[810px] space-y-3 lg:space-y-5">
              <h1 className="mx-auto mb-10 w-fit break-all text-center text-2xl font-bold">
                View Engineering Component -{" "}
                <span className="font-medium">{formData?.name || ""}</span>
              </h1>
              <div className="w-full text-sm">
                <label className="required mb-1 block font-medium">Name</label>
                <div className="w-full break-all rounded-lg border border-gray-300 bg-white px-2.5 py-2">
                  {formData.name}
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="required mb-1 block font-medium">Material</label>
                  <div className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2">
                    {formData.material}
                  </div>
                </div>
                <div className="w-full">
                  <label className="required mb-1 block font-medium"> Weight</label>
                  <div className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2">
                    {formData.weight}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <RichTextEditor
                  handleChange={() => {}}
                  defaultValue={formData.description}
                  disabled={true}
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                <div className="basis-1/2">
                  <label className="required mb-1 block text-sm font-medium">Hero media</label>
                  <div className="h-28 w-44 rounded-lg bg-white">
                    {formData.hero_image ? (
                      formData.hero_image.type === "video" ? (
                        <BaseVideo
                          src={formData.hero_image.url}
                          autoPlay={false}
                          muted={true}
                          loop={true}
                          classes="object-contain w-full h-full"
                        />
                      ) : (
                        <BaseImage
                          width={formData.hero_image.formats.thumbnail.width}
                          height={formData.hero_image.formats.thumbnail.height}
                          src={formData.hero_image.formats.thumbnail.url}
                          alt={formData.hero_image.name}
                          classes="object-contain w-full h-full"
                        />
                      )
                    ) : null}
                  </div>
                </div>
                <div className="basis-1/2">
                  <label className="required mb-1 block text-sm font-medium">Detail Images</label>
                  <div className="flex flex-wrap items-center gap-4">
                    {formData.media ? (
                      Array.isArray(formData.media) ? (
                        formData.media.map((item, index) => {
                          if (item && item?.formats) {
                            return (
                              <div className="h-28 w-44 rounded-md bg-white" key={index}>
                                <BaseImage
                                  key={index}
                                  width={item.formats.thumbnail.width}
                                  height={item.formats.thumbnail.height}
                                  src={item.formats.thumbnail.url}
                                  alt={item.name}
                                  classes="object-contain w-full h-full"
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
                            classes="object-contain w-full h-full"
                          />
                        </div>
                      )
                    ) : (
                      <div className="h-28 w-44"></div>
                    )}
                  </div>
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
