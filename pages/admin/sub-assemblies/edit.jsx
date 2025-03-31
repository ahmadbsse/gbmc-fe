import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { sanitizeText } from "@/utils";
import { transformMedia, uploadFilesRequest, deleteFilesRequest, decodeText } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton, SeoHead } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import { subAssemblyValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";
import WarningModal from "@/components/admin/WarningModal";

const EditSubAssembly = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [idsToRemove, setIdsToRemove] = useState([]);

  useEffect(() => {
    if (formData) {
      if (
        formData.name.trim() === "" ||
        formData.number.trim() === "" ||
        formData.oem_number.trim() === "" ||
        formData.weight.trim() === "" ||
        formData?.media?.length === 0 ||
        formData?.media === ""
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData]);
  const getSubAssemblyDetails = async () => {
    try {
      const url = `/sub-assemblies/${id}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = transformMedia(res.data);
        delete response.id;
        delete response.updatedAt;
        delete response.createdAt;
        delete response.publishedAt;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        response.name = decodeText(response.name);
        response.number = decodeText(response.number);
        response.oem_number = decodeText(response.oem_number);
        response.weight = decodeText(response.weight);

        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subAssemblyValidator(formData)) {
      setLoading(true);
      try {
        const flattenedData = formData.media
          .flat()
          .filter((item) => item && typeof item === "object" && !item.id);

        const previousMedia = formData.media.filter((item) => item && item.id);
        const newMediaIds = previousMedia.map((file) => file.id);
        delete formData.documentId;
        await uploadFilesRequest(flattenedData, true)
          .then((res) => {
            if (res) {
              formData.media = [...res, ...newMediaIds];
              saveData();
            } else {
              formData.media = newMediaIds;
              saveData();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const sanitizedFormData = () => {
    return {
      ...formData,
      name: sanitizeText(formData.name),
      number: sanitizeText(formData.number),
      oem_number: sanitizeText(formData.oem_number),
      weight: sanitizeText(formData.weight),
    };
  };
  const saveData = () => {
    try {
      apiClient
        .PUT(`/sub-assemblies/${id}`, { data: sanitizedFormData() })
        .then(async () => {
          showToast(`${formData.name} Saved Successfully`, "success");
          router.push("/admin");
          await deleteFilesRequest(idsToRemove).then(() => {});
        })
        .catch((error) => {
          showToast(error.message, "error", true);
        });
    } catch (error) {
      showToast(error.message, "error", true);
    }
  };
  const deletePreviousImage = async (id) => {
    setFormData(removeMediaById(id));
    setIdsToRemove([...idsToRemove, id]);
  };
  function removeMediaById(idToRemove) {
    return {
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem.id !== idToRemove),
    };
  }
  useEffect(() => {
    if (id) {
      getSubAssemblyDetails();
    }
  }, [id]);
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
  const removeMedia = (file) => {
    setFormData({
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem?.preview !== file?.preview),
    });
  };
  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      router.push("/admin");
    }
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
          type="modify"
        />
      ) : null}
      <SeoHead title="Admin" />
      <div className="mt-20 min-h-screen bg-gray-50">
        <Navbar isAdmin setTab={setTab} activeTab={"Assemblies"} />
        <main className="mx-auto px-4 py-8 sm:container">
          {formData ? (
            <>
              <h1 className="mx-auto mb-10 w-fit max-w-[810px] break-all text-center text-2xl font-bold">
                Edit Assembly - <span className="font-medium">{formData?.name || ""}</span>
              </h1>
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-[810px] space-y-3 lg:space-y-5"
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="w-full">
                    <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                      Name
                    </label>
                    <input
                      maxLength={255}
                      id="name"
                      title={formData.name}
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
                      Registred Number
                    </label>
                    <input
                      id="registered_number"
                      required
                      title={formData.number}
                      type="number"
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
                    <label htmlFor="oem_number" className="required mb-1 block text-sm font-medium">
                      OEM Numbers
                    </label>
                    <input
                      id="oem_number"
                      required
                      title={formData.oem_number}
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
                      required
                      type="text"
                      title={formData.weight}
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
                <div className="flex items-center gap-4">
                  {formData?.media?.map((item) => {
                    if (item && item?.formats) {
                      return (
                        <div
                          className="relative h-32 w-44 rounded-md bg-white"
                          key={item.documentId}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deletePreviousImage(item.id);
                            }}
                            className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                          <BaseImage
                            width={item?.formats?.thumbnail?.width}
                            height={item?.formats?.thumbnail?.height}
                            src={item?.formats?.thumbnail?.url}
                            alt={item?.name}
                            classes="object-contain w-full h-full"
                          />
                        </div>
                      );
                    }
                  })}
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
                      setShowWarning(true);
                    }}
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton loading={loading} type="submit" disabled={!isFormValid}>
                    Save
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

export default EditSubAssembly;
