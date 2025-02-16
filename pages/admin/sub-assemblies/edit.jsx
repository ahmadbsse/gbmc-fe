import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { transformMedia, uploadFilesRequest, deleteFilesRequest } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton, SeoHead } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import { subAssemblyValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const EditSubAssembly = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [idsToRemove, setIdsToRemove] = useState([]);

  useEffect(() => {
    if (formData) {
      if (
        formData.name === "" ||
        formData.number === "" ||
        formData.oem_number === "" ||
        formData.weight === "" ||
        formData.description === "" ||
        formData.summary === "" ||
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
        await uploadFilesRequest(flattenedData, true)
          .then((res) => {
            if (res) {
              formData.media = [...res, ...newMediaIds];
              delete formData.documentId;
              try {
                apiClient
                  .PUT(`/sub-assemblies/${id}`, { data: formData })
                  .then(async () => {
                    showToast("Sub Assembly Saved Successfully", "success");
                    router.push("/admin");
                    await deleteFilesRequest(idsToRemove).then(() => {
                      console.log("Files deleted successfully");
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    showToast(error.message, "error");
                  });
              } catch (error) {
                console.log(error);
                showToast(error.message, "error");
              }
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
  return (
    <>
      <SeoHead title="Admin" />
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <>
              <h1 className="mx-auto mb-10 w-fit text-2xl font-bold">
                Edit Sub Assembly - {formData.name || ""}
              </h1>
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
                    <label className="required mb-1 block text-sm font-medium">
                      Registred Number
                    </label>
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
                <div className="flex items-center gap-4">
                  {formData?.media?.map((item) => {
                    if (item && item?.formats) {
                      return (
                        <div className="relative h-32 w-44" key={item.documentId}>
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
                            classes="object-cover w-full h-full"
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
                <div className="mx-auto w-[300px] py-4">
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
