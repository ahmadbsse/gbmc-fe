import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";

import { BaseButton, SeoHead } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import showToast from "@/utils/toast";
import { engineeringComponentValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

import { uploadFilesRequest } from "@/utils";

const CreateEngineeringComponent = () => {
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

  useEffect(() => {
    if (
      formData.name.trim() === "" ||
      formData.material.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.description == `<p><br></p>` ||
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (engineeringComponentValidator(formData)) {
      setLoading(true);
      const media = formData.media;
      const hero_image = formData.hero_image;
      try {
        await uploadFilesRequest(media, true).then(async (res) => {
          if (res) {
            formData.media = res;
          }
          try {
            await uploadFilesRequest(hero_image, true).then((res) => {
              if (res) {
                formData.hero_image = res[0];
              }
              try {
                apiClient
                  .POST(`/engineering-components`, { data: formData })
                  .then(() => {
                    setFormData(initialFormData);
                    showToast("Engineering component Created Successfully", "success");
                    router.push("/admin");
                  })
                  .catch((error) => {
                    console.log(error);
                    showToast(error.message, "error");
                  });
              } catch (error) {
                console.error(error);
              }
            });
          } catch (error) {
            console.error(error);
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
        hero_image: [...prevData?.media, ...media],
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
  return (
    <>
      <SeoHead title="Admin" />

      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">Create Engineering Component</h1>
          <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type name`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Material</label>
                <input
                  type="text"
                  required
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type material name`}
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium"> Weight</label>
                <input
                  type="text"
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
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            {/* <pre>{JSON.stringify(formData.hero_image, null, 2)}</pre> */}
            <div className="flex gap-2">
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Hero Image</label>
                <BaseFileUploader
                  setDataFilesIds={setHeroImage}
                  disabled={formData?.hero_image != "" || formData?.hero_image?.length > 1}
                />
              </div>
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Detail Images</label>
                <BaseFileUploader setDataFilesIds={setMedia} multiple={true} />
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
