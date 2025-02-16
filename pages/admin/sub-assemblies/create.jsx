import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";

import { uploadFilesRequest } from "@/utils";
import { BaseButton, SeoHead } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import showToast from "@/utils/toast";
import { subAssemblyValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const CreateSubAssembly = () => {
  const router = useRouter();
  const initialFormData = {
    name: "",
    number: "",
    oem_number: "",
    weight: "",
    description: "",
    active: false,
    featured: false,
    media: "",
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (
      formData.name.trim() === "" ||
      formData.number.trim() === "" ||
      formData.oem_number.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.description === `<p><br></p>` ||
      formData.media.length === 0 ||
      formData.media == ""
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [formData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subAssemblyValidator(formData)) {
      setLoading(true);
      await uploadFilesRequest(formData.media, true).then((res) => {
        if (res) {
          formData.media = res;
        }
        try {
          apiClient
            .POST(`/sub-assemblies`, { data: formData })
            .then(() => {
              setFormData(initialFormData);
              showToast("Sub Assembly Created Successfully", "success");
              router.push("/admin");
            })
            .catch((error) => {
              console.log(error);
              showToast(error.message, "error");
            });
        } catch (error) {
          console.log(error);
          showToast(error.message, "error");
        } finally {
          setLoading(false);
        }
      });
    }
  };

  const handleChange = (content) => {
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
  return (
    <>
      <SeoHead title="Admin" />

      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">Create Sub Assembly</h1>
          <pre>{JSON.stringify(formData.media, null, 2)}</pre>
          <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3">
            <div className="flex flex-col md:flex-row md:gap-4">
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
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">Registered Number</label>
                <input
                  required
                  type="number"
                  min={1}
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type number`}
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">OEM Numbers</label>
                <input
                  required
                  type="text"
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type comma sepereated numbers..`}
                  value={formData.oem_number}
                  onChange={(e) => setFormData({ ...formData, oem_number: e.target.value })}
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

            <RichTextEditor handleChange={handleChange} defaultValue={formData.description} />
            <div>
              <label className="required mb-1 block text-sm font-medium"> Media</label>
              <BaseFileUploader setDataFilesIds={setMedia} multiple={true} />
            </div>
            <div className="flex flex-col gap-2 pt-4">
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
export default CreateSubAssembly;
