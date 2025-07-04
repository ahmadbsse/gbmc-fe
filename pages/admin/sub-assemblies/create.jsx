import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";

import { uploadFilesRequest, deepEqual, sanitizeText } from "@/utils";
import { BaseButton, SeoHead } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import showToast from "@/utils/toast";
import { subAssemblyValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";
import WarningModal from "@/components/admin/WarningModal";

import useMarqueeStateStore from "@/stores/marquee";

const CreateSubAssembly = () => {
  const { hasMarquee } = useMarqueeStateStore();
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
    pdf: {},
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const deepCopy = structuredClone(initialFormData);
  useEffect(() => {
    if (formData) {
      if (
        formData?.name.trim() === "" ||
        formData?.number.trim() === "" ||
        formData?.oem_number.trim() === "" ||
        formData?.weight.trim() === "" ||
        formData?.media.length === 0 ||
        formData?.media == ""
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData]);
  const sanitizedFormData = () => {
    return {
      ...formData,
      name: sanitizeText(formData.name),
      number: sanitizeText(formData.number),
      oem_number: sanitizeText(formData.oem_number),
      weight: sanitizeText(formData.weight),
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subAssemblyValidator(formData)) return;

    try {
      setLoading(true);

      // Upload media
      const mediaRes = await uploadFilesRequest(formData.media, true);
      if (mediaRes) {
        formData.media = mediaRes;
      }

      // Upload PDF if present
      if (formData.pdf && formData.pdf.length > 0) {
        const pdfFormdata = new FormData();
        formData.pdf.forEach((file) => {
          pdfFormdata.append("files", file.file); // Ensure `file.file` is correct
        });

        const pdfResponse = await apiClient.UPLOAD("/upload", pdfFormdata);
        if (pdfResponse && pdfResponse.length > 0) {
          formData.pdf = pdfResponse[0];
        }
      }

      // Final API call
      await apiClient.POST(`/sub-assemblies`, { data: sanitizedFormData() });

      setFormData(initialFormData);
      router.push("/admin");
      showToast(`${formData.name} Created Successfully`, "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Something went wrong", "error", true);
    } finally {
      setLoading(false);
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
  const setPDF = (file) => {
    if (typeof file === "object") {
      setFormData({ ...formData, pdf: file });
    }
  };
  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      router.push("/admin");
    }
  };
  const removeMedia = (file) => {
    setFormData({
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem?.preview !== file?.preview),
    });
  };
  const removePDF = () => {
    setFormData({ ...formData, pdf: {} });
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
          currentTab="sub-assemblies"
          type="create"
        />
      ) : null}
      <SeoHead title="Admin" />
      <Navbar isAdmin setTab={setTab} activeTab={"Assemblies"} showMarquee={false} />
      <div className={`min-h-screen bg-[#f3f3f3] ${hasMarquee ? "mt-28" : "mt-20"}`}>
        <main className="mx-auto px-4 py-8 sm:container">
          <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">Create Assembly</h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3 lg:space-y-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  title={formData.name}
                  maxLength={255}
                  required
                  type="text"
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type name`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="registered_number"
                  className="required mb-1 block text-sm font-medium"
                >
                  GM part number
                </label>
                <input
                  id="registered_number"
                  required
                  type="number"
                  title={formData.number}
                  min={1}
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type number`}
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="oem_numbers" className="required mb-1 block text-sm font-medium">
                  OEM Numbers
                </label>
                <input
                  title={formData.oem_number}
                  id="oem_numbers"
                  required
                  type="text"
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type comma sepereated numbers..`}
                  value={formData.oem_number}
                  onChange={(e) => setFormData({ ...formData, oem_number: e.target.value })}
                />
              </div>
              <div className="w-full">
                <label htmlFor="weight" className="required mb-1 block text-sm font-medium">
                  {" "}
                  Weight
                </label>
                <input
                  id="weight"
                  title={formData.weight}
                  required
                  maxLength={150}
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
              <BaseFileUploader
                setDataFilesIds={setMedia}
                multiple={true}
                removeMedia={removeMedia}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Specification PDF</label>
              <BaseFileUploader
                setDataFilesIds={setPDF}
                multiple={false}
                isPDF={true}
                removeMedia={removePDF}
                disabled={Object.keys(formData?.pdf).length === 0 ? false : true}
              />
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
export default CreateSubAssembly;
