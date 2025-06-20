import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";
import { sanitizeText } from "@/utils";
import WarningModal from "@/components/admin/WarningModal";
import { BaseButton, SeoHead } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import showToast from "@/utils/toast";
import { engineeringComponentValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

import { uploadFilesRequest, deepEqual } from "@/utils";
import useMarqueeStateStore from "@/stores/marquee";

const CreateEngineeringComponent = () => {
  const { hasMarquee } = useMarqueeStateStore();
  const router = useRouter();
  const initialFormData = {
    name: "",
    description: "",
    active: false,
    featured: false,
    media: "",
    hero_image: "",
    material: "",
    weight: "",
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const deepCopy = structuredClone(initialFormData);

  useEffect(() => {
    if (
      formData.name.trim() === "" ||
      formData.material.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.media.length === 0 ||
      formData.media == "" ||
      formData.hero_image == "" ||
      formData.hero_image.length === 0
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [formData]);
  const sanitizedFormData = () => {
    return {
      ...formData,
      name: sanitizeText(formData.name),
      description: formData.description,
      material: sanitizeText(formData.material),
      weight: sanitizeText(formData.weight),
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (engineeringComponentValidator(formData)) {
      try {
        setLoading(true);
        const media = formData.media;
        const hero_image = formData.hero_image;

        const mediaRes = await uploadFilesRequest(media, true);
        if (mediaRes) {
          formData.media = mediaRes;
        }

        const heroImageRes = await uploadFilesRequest(hero_image, true);
        if (heroImageRes) {
          formData.hero_image = heroImageRes[0];
        }

        await apiClient.POST(`/engineering-components`, { data: sanitizedFormData() });

        setFormData(initialFormData);
        router.push("/admin");
        showToast(`${formData.name} Created Successfully`, "success");
      } catch (error) {
        console.error(error);
        showToast(error.message || "Something went wrong", "error", true);
      } finally {
        setLoading(false); // Only ends loading after all is done or failed
      }
    }
  };

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
    } else {
      setFormData({ ...formData, hero_image: "" });
    }
  };
  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      router.push("/admin");
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
          onClose={(check) => {
            if (check) {
              setShowWarning(false);
              router.push("/admin");
            } else {
              setShowWarning(false);
            }
          }}
          currentTab="engineering-components"
          type="create"
        />
      ) : null}
      <SeoHead title="Admin" />
      <Navbar isAdmin setTab={setTab} activeTab={"Engineering Components"} showMarquee={false} />
      <div className={`min-h-screen bg-[#f3f3f3] ${hasMarquee ? "mt-28" : "mt-20"}`}>
        <main className="mx-auto px-4 py-8 sm:container">
          <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">Create Engineering Component</h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3 lg:space-y-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  maxLength={255}
                  type="text"
                  title={formData.name}
                  required
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type name`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="material" className="required mb-1 block text-sm font-medium">
                  Material
                </label>
                <input
                  id="material"
                  title={formData.material}
                  type="text"
                  required
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type material name`}
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
              <div className="w-full">
                <label htmlFor="weight" className="required mb-1 block text-sm font-medium">
                  {" "}
                  Weight
                </label>
                <input
                  id="weight"
                  type="text"
                  maxLength={150}
                  title={formData.weight}
                  required
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
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Hero media</label>
                <BaseFileUploader
                  setDataFilesIds={setHeroImage}
                  disabled={formData?.hero_image != "" || formData?.hero_image?.length > 1}
                />
              </div>
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Detail Images</label>
                <BaseFileUploader
                  setDataFilesIds={setMedia}
                  multiple={true}
                  removeMedia={removeDetailsMedia}
                />
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
                  if (deepEqual(deepCopy, formData)) {
                    router.push("/admin");
                  } else {
                    setShowWarning(true);
                  }
                }}
              >
                Cancel
              </BaseButton>
              <BaseButton loading={loading} type="submit" disabled={!isFormValid}>
                save
              </BaseButton>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};
export default CreateEngineeringComponent;
