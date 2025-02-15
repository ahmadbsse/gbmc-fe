import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { transformMedia, transformHeroVideo } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton, BaseVideo, SeoHead } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import { editEngineeringComponentValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const EditComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);
  const [heroFileId, setHeroFileId] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (formData) {
      if (
        formData.name.trim() === "" ||
        formData.material.trim() === "" ||
        formData.weight.trim() === "" ||
        formData.description == `<p><br></p>` ||
        formData.summary === `<p><br></p>` ||
        formData.media.length === 0 ||
        (dataFilesIds.length === 0 && formData.media.length === 0) ||
        (heroFileId.length === 0 && Object.keys(formData.hero_image).length === 0)
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData, dataFilesIds, heroFileId]);
  const getComponentDetails = async () => {
    try {
      const url = `/engineering-components/${id}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = transformMedia(res.data);
        delete response.id;
        delete response.updatedAt;
        delete response.createdAt;
        delete response.publishedAt;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        if (response.hero_image && response.hero_image.mime?.includes("video")) {
          response.hero_image = transformHeroVideo(response.hero_image);
        }
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (heroFileId.length === 0) {
      formData.hero_image = formData.hero_image.id;
    } else {
      formData.hero_image = heroFileId;
    }
    if (dataFilesIds.length === 0) {
      if (Array.isArray(formData.media)) {
        formData.media = formData.media.map((item) => item.id);
      } else {
        formData.media = formData.media.id;
      }
    } else {
      formData.media = [...formData.media.map((item) => item.id), ...dataFilesIds];
    }
    if (editEngineeringComponentValidator(formData)) {
      delete formData.documentId;
      try {
        apiClient
          .PUT(`/engineering-components/${id}`, { data: formData })
          .then(() => {
            showToast("Engineering component saved Successfully", "success");
            router.push("/admin");
          })
          .catch((error) => {
            showToast(error.message, "error");
            console.log(error);
          });
      } catch (error) {
        showToast(error.message, "error");
        console.log(error);
      }
    }
  };
  const deletePreviousImage = async (id, key) => {
    setFormData(removeMediaById(id, key));
  };
  function removeMediaById(idToRemove, key) {
    if (key == "media")
      return {
        ...formData,
        media: formData.media.filter((mediaItem) => mediaItem.id !== idToRemove),
      };
    else
      return {
        ...formData,
        hero_image: {},
      };
  }
  useEffect(() => {
    if (id) {
      getComponentDetails();
    }
  }, [id]);
  const handleChangeDescription = (content) => {
    setFormData({ ...formData, description: content });
  };
  const handleChangeSummary = (content) => {
    setFormData({ ...formData, summary: content });
  };
  return (
    <>
      <SeoHead title="Admin" />
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <>
              <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">
                Edit Engineering Component - {formData.name || ""}
              </h1>
              <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3">
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter name`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Material</label>
                    <input
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Enter material name`}
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium"> Weight</label>
                    <input
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Enter weight`}
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
                <RichTextEditor
                  handleChange={handleChangeSummary}
                  defaultValue={formData.summary}
                  label="Summary"
                />
                <RichTextEditor
                  handleChange={handleChangeDescription}
                  defaultValue={formData.description}
                />

                <div className="flex gap-2">
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Hero Image</label>
                    <BaseFileUploader
                      setDataFilesIds={setHeroFileId}
                      disabled={
                        heroFileId != "" ||
                        heroFileId.length > 1 ||
                        (formData.hero_image && Object.keys(formData.hero_image).length)
                      }
                    />
                    {formData.hero_image && Object.keys(formData.hero_image).length != 0 ? (
                      <div className="relative mt-2 h-32 w-48">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deletePreviousImage(formData.hero_image.id, "hero_image");
                          }}
                          className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                        {formData.hero_image.type === "video" ? (
                          <BaseVideo
                            src={formData.hero_image.url}
                            autoPlay={true}
                            muted={true}
                            loop={true}
                            classes="object-cover w-full h-full"
                          />
                        ) : (
                          <BaseImage
                            width={formData.hero_image.formats?.thumbnail?.width || 200}
                            height={formData.hero_image.formats?.thumbnail?.height || 160}
                            src={formData.hero_image.formats?.thumbnail?.url}
                            alt={formData.hero_image.name}
                            classes="object-cover w-full h-full"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Detail Images</label>
                    <BaseFileUploader setDataFilesIds={setDataFilesIds} multiple={true} />
                    {formData.media ? (
                      <div className="flex flex-wrap items-center gap-4">
                        {formData?.media?.map((item, index) => {
                          if (item) {
                            return (
                              <div
                                className="relative mt-2 h-32 w-48"
                                key={item.documentId + index + item.id}
                              >
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    deletePreviousImage(item.id, "media");
                                  }}
                                  className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                                >
                                  <X className="h-4 w-4 text-white" />
                                </button>
                                <BaseImage
                                  width={item.formats?.thumbnail?.width || 200}
                                  height={item.formats?.thumbnail?.height || 200}
                                  src={item.formats?.thumbnail?.url}
                                  alt={item.name}
                                  classes="object-cover w-full h-full"
                                />
                              </div>
                            );
                          }
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-3">
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                    />
                    <label htmlFor="active" className="text-sm">
                      Mark as active
                    </label>
                  </div>

                  <div className="flex w-full items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm">
                      Mark as featured
                    </label>
                  </div>
                </div>
                <div className="mx-auto w-[300px] py-4">
                  <BaseButton loading={false} disabled={!isFormValid} type="submit">
                    save
                  </BaseButton>
                </div>
              </form>
            </>
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

export default EditComponent;
