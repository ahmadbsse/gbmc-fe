import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";
import { ChevronDown } from "lucide-react";
import showToast from "@/utils/toast";
import { BaseButton, SeoHead } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { partValidator } from "@/utils/validators";
import { uploadFilesRequest, deepEqual, decodeText } from "@/utils";
import RichTextEditor from "@/components/common/RichTextEditor";

import { sanitizeText } from "@/utils";
import WarningModal from "@/components/admin/WarningModal";

const CreatePart = () => {
  const router = useRouter();
  const initialFormData = {
    name: "",
    number: "",
    material: "",
    weight: "",
    supplier: "",
    description: "",
    active: false,
    featured: false,
    media: "",
    oem_number: "",
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [makes, setMakes] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const deepCopy = structuredClone(initialFormData);

  useEffect(() => {
    if (
      formData.name.trim() === "" ||
      formData.number.trim() === "" ||
      formData.material.trim() === "" ||
      formData.supplier.trim() === "" ||
      formData.oem_number.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.media.length === 0 ||
      formData.media == ""
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
      number: sanitizeText(formData.number),
      material: sanitizeText(formData.material),
      weight: sanitizeText(formData.weight),
      oem_number: sanitizeText(formData.oem_number),
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (partValidator(formData)) {
      setLoading(true);
      await uploadFilesRequest(formData.media, true)
        .then((res) => {
          if (res) {
            formData.media = res;
            try {
              apiClient
                .POST(`/parts`, { data: sanitizedFormData() })
                .then(() => {
                  setFormData(initialFormData);
                  showToast(`${formData.name} created successfully`, "success");
                  router.push("/admin");
                })
                .catch((error) => {
                  showToast(error.message, "error", true);
                });
            } catch (error) {
              showToast(error.message, "error", true);
            }
          }
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const getMakes = async () => {
    try {
      const url = `/suppliers?fields=name&filters[active]=true`;
      await apiClient.GET(url).then((res) => {
        res.data.forEach((supplier) => {
          supplier.name = decodeText(supplier.name);
        });
        setMakes(res.data);
        if (res.data.length == 0) {
          showToast("Please add Make first", "warning", true);
        }
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  useEffect(() => {
    getMakes();
  }, []);
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
  const [hasMarquee, setHasMarquee] = useState(false);
  useEffect(() => {
    const hasMarquee = localStorage.getItem("hasMarquee");
    if (hasMarquee) {
      setHasMarquee(JSON.parse(hasMarquee));
    }
  }, []);
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
          currentTab="parts"
          type="create"
        />
      ) : null}
      <SeoHead title="Admin" />
      <Navbar isAdmin setTab={setTab} activeTab={"Parts"} />
      <div className={`min-h-screen bg-[#f3f3f3] ${hasMarquee ? "mt-28" : "mt-20"}`}>
        <main className="mx-auto px-4 py-8 sm:container">
          <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">Create Part</h1>

          <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3 lg:space-y-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  required
                  id="name"
                  title={formData?.name}
                  maxLength={255}
                  type="text"
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type name`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative w-full">
                <label htmlFor="make" className="required mb-1 block text-sm font-medium">
                  Make
                </label>
                <select
                  id="make"
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                >
                  <option value="">Select a make</option>
                  {makes.map((supplier) => (
                    <option key={supplier.id} value={supplier.documentId}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2">
                  <ChevronDown className="h-5 w-5 pt-1" />
                </div>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="oem_numbers" className="required mb-1 block text-sm font-medium">
                OEM Numbers
              </label>
              <input
                id="oem_numbers"
                required
                title={formData?.oem_number}
                type="text"
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder={`Type comma seperated numbers...`}
                value={formData.oem_number}
                onChange={(e) => setFormData({ ...formData, oem_number: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="material" className="required mb-1 block text-sm font-medium">
                  Material
                </label>
                <input
                  required
                  id="material"
                  type="text"
                  title={formData?.material}
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type material`}
                  value={formData?.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
              <div className="w-full">
                <label htmlFor="weight" className="required mb-1 block text-sm font-medium">
                  Weight
                </label>
                <input
                  required
                  id="weight"
                  type="text"
                  maxLength={150}
                  title={formData?.weight}
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type weight`}
                  value={formData?.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="registration_number"
                  className="required mb-1 block text-sm font-medium"
                >
                  GM part number
                </label>
                <input
                  id="registration_number"
                  required
                  type="number"
                  min={1}
                  title={formData?.number}
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Type number`}
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
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
export default CreatePart;
