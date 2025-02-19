import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import WarningModal from "@/components/admin/WarningModal";
import apiClient from "@/utils/apiClient";
import {
  transformMedia,
  transformHeroVideo,
  uploadFilesRequest,
  deleteFilesRequest,
} from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton, BaseVideo, SeoHead } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import { engineeringComponentValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const EditComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [idsToRemove, setIdsToRemove] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      if (
        formData.name.trim() === "" ||
        formData.material.trim() === "" ||
        formData.weight.trim() === "" ||
        formData.description == `<p><br></p>` ||
        formData?.media?.length === 0 ||
        formData?.hero_image?.length === 0 ||
        formData?.media === "" ||
        formData?.hero_image === ""
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (engineeringComponentValidator(formData)) {
      setLoading(true);
      const flattenedMediaData = formData.media
        .flat()
        .filter((item) => item && typeof item === "object" && !item.id);
      const flattenedHeroData = formData.media
        .flat()
        .filter((item) => item && typeof item === "object" && !item.id);

      const previousHero = formData.media.filter((item) => item && item.id);
      const previousMedia = formData.media.filter((item) => item && item.id);
      const newMediaIds = previousMedia.map((file) => file.id);

      const newHeroIds = previousHero.map((file) => file.id);

      delete formData.documentId;
      console.log(flattenedHeroData, "hero");
      console.log(flattenedMediaData, "media");
      if (flattenedHeroData.length !== 0 && flattenedMediaData.length !== 0) {
        await uploadFilesRequest(flattenedMediaData, true).then(async (res) => {
          if (res) {
            formData.media = [...res, ...newMediaIds];
          } else {
            formData.media = newMediaIds;
          }
          await uploadFilesRequest(flattenedHeroData, true).then((res) => {
            if (res) {
              formData.hero_image = [...res, ...newHeroIds];
              saveData();
            } else {
              formData.hero_image = newHeroIds;
            }
          });
        });
      } else {
        formData.media = newMediaIds;
        formData.hero_image = newHeroIds;
        saveData();
      }
    }
  };
  const saveData = () => {
    try {
      apiClient
        .PUT(`/engineering-components/${id}`, { data: formData })
        .then(async () => {
          showToast("Engineering component saved Successfully", "success");
          await deleteFilesRequest(idsToRemove).then(() => {
            console.log("Files deleted successfully");
          });
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
  };
  const deletePreviousImage = async (id, key) => {
    setFormData(removeMediaById(id, key));
    setIdsToRemove([...idsToRemove, id]);
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
        hero_image: "",
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
  const setMedia = (media) => {
    if (typeof media === "object") {
      setFormData((prevData) => ({
        ...prevData,
        media: [...prevData?.media, ...media],
      }));
    }
  };
  const setHeroImage = (hero_image) => {
    if (typeof hero_image === "object") {
      setFormData((prevData) => ({
        ...prevData,
        hero_image: [...prevData?.hero_image, ...hero_image],
      }));
    }
  };
  const removeDetailsMedia = (file) => {
    setFormData({
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem?.preview !== file?.preview),
    });
  };
  return (
    <>
      {showWarning ? (
        <WarningModal
          onClose={(e) => {
            setShowWarning(false);
            router.push("/admin");
          }}
          currentTab="engineering-components"
          type="modify"
        />
      ) : null}
      <SeoHead title="Admin" />
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto mt-20 px-4 py-8">
          {formData ? (
            <>
              <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">
                Edit Engineering Component - {formData.name || ""}
              </h1>
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-[810px] space-y-3 lg:space-y-5"
              >
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">Name</label>
                  <input
                    required
                    type="text"
                    className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Type name`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Material</label>
                    <input
                      required
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Type material`}
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium"> Weight</label>
                    <input
                      required
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Type weight`}
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
                <RichTextEditor
                  handleChange={handleChangeDescription}
                  defaultValue={formData.description}
                />

                <div className="flex gap-2">
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Hero Image</label>

                    <BaseFileUploader
                      setDataFilesIds={setHeroImage}
                      disabled={
                        formData?.hero_image != "" || Object.keys(formData.hero_image).length !== 0
                      }
                    />
                    {formData.hero_image &&
                    Object.keys(formData.hero_image).length !== 0 &&
                    (formData.hero_image?.url || formData.hero_image?.formats) ? (
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
                        {formData.hero_image?.type === "video" && formData.hero_image?.url ? (
                          <BaseVideo
                            src={formData.hero_image.url}
                            autoPlay={true}
                            muted={true}
                            loop={true}
                            classes="object-cover w-full h-full"
                          />
                        ) : formData.hero_image && formData.hero_image.formats ? (
                          <BaseImage
                            width={formData.hero_image.formats?.thumbnail?.width || 200}
                            height={formData.hero_image.formats?.thumbnail?.height || 160}
                            src={formData.hero_image.formats?.thumbnail?.url}
                            alt={formData.hero_image.name}
                            classes="object-cover w-full h-full"
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="required mb-1 block text-sm font-medium">Detail Images</label>
                    <BaseFileUploader
                      setDataFilesIds={setMedia}
                      multiple={true}
                      removeMedia={removeDetailsMedia}
                    />
                    {formData.media ? (
                      <div className="flex flex-wrap items-center gap-4">
                        {formData?.media?.map((item, index) => {
                          if (item && item?.formats) {
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
                <div className="mx-auto flex w-[300px] gap-4 py-4">
                  <BaseButton
                    btnStyle
                    loading={false}
                    type="button"
                    handleClick={() => {
                      setShowWarning(true);
                    }}
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton loading={loading} disabled={!isFormValid} type="submit">
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
