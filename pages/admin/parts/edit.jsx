import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import apiClient from "@/utils/apiClient";
import {
  transformMedia,
  uploadFilesRequest,
  deleteFilesRequest,
  richTextHasOnlySpaces,
} from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton, SeoHead } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import RichTextEditor from "@/components/common/RichTextEditor";
import { partValidator } from "@/utils/validators";
import WarningModal from "@/components/admin/WarningModal";

const EditPart = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [idsToRemove, setIdsToRemove] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (formData) {
      if (
        formData.name.trim() === "" ||
        formData.number.trim() === "" ||
        formData.material.trim() === "" ||
        formData.supplier === "" ||
        formData.oem_number.trim() === "" ||
        formData.weight.trim() === "" ||
        formData.description === `<p><br></p>` ||
        richTextHasOnlySpaces(formData.description) ||
        formData?.media?.length === 0
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData]);
  const getPartDetails = async () => {
    try {
      const url = `/parts/${id}?populate=*`;
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
  const getSuppliers = async () => {
    try {
      const url = `/suppliers?fields=name&filters[active]=true`;
      await apiClient.GET(url).then((res) => {
        setSuppliers(res.data);
        if (res.data.length == 0) {
          showToast("Please add Make first", "warning");
        }
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (partValidator(formData)) {
      setLoading(true);
      try {
        const flattenedData = formData.media
          .flat()
          .filter((item) => item && typeof item === "object" && !item.id);
        const previousMedia = formData.media.filter((item) => item && item.id);
        const newMediaIds = previousMedia.map((file) => file.id);
        formData.supplier = formData.supplier.documentId;
        delete formData.documentId;
        await uploadFilesRequest(flattenedData, true).then((res) => {
          if (res) {
            formData.media = [...res, ...newMediaIds];
            saveData();
          } else {
            formData.media = newMediaIds;
            saveData();
          }
        });
      } catch (error) {
        console.log(error);
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };
  const saveData = () => {
    try {
      apiClient
        .PUT(`/parts/${id}`, { data: formData })
        .then(async () => {
          showToast("Part Saved Successfully", "success");
          await deleteFilesRequest(idsToRemove).then(() => {
            console.log("Files deleted successfully");
          });
          router.push("/admin");
        })
        .catch((error) => {
          console.log(error);
          showToast(error.message, "error");
        });
    } catch (error) {
      console.log(error);
      showToast(error.message, "error");
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
      getPartDetails();
      getSuppliers();
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
          currentTab="parts"
          type="modify"
        />
      ) : null}
      <SeoHead title="Admin" />
      <div className="mt-20 min-h-screen bg-gray-50">
        <Navbar isAdmin setTab={setTab} activeTab={"Parts"} />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <>
              <h1 className="mx-auto mb-10 w-fit text-center text-2xl font-bold">
                Edit Part - {formData.name || ""}
              </h1>
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-[810px] space-y-3 lg:space-y-5"
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="w-full">
                    <label for="name" className="required mb-1 block text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      maxlength={255}
                      required
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Type name`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="relative w-full">
                    <label for="make" className="required mb-1 block text-sm font-medium">
                      Make
                    </label>
                    <select
                      id="make"
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      value={JSON.stringify(formData.supplier.documentId)}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          supplier: JSON.parse(e.target.value), // Assign only documentId here
                        });
                      }}
                    >
                      <option value="">Select a make</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={JSON.stringify(supplier.documentId)}>
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
                  <label for="oem_numbers" className="required mb-1 block text-sm font-medium">
                    OEM Numbers
                  </label>
                  <input
                    id="oem_numbers"
                    required
                    type="text"
                    className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Type comma seperated numbers...`}
                    value={formData.oem_number}
                    onChange={(e) => setFormData({ ...formData, oem_number: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="w-full">
                    <label for="material" className="required mb-1 block text-sm font-medium">
                      Material
                    </label>
                    <input
                      id="material"
                      required
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Type material`}
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div className="w-full">
                    <label for="weight" className="required mb-1 block text-sm font-medium">
                      Weight
                    </label>
                    <input
                      id="weight"
                      required
                      type="text"
                      className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                      placeholder={`Type weight`}
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      for="registered_number"
                      className="required mb-1 block text-sm font-medium"
                    >
                      Registered Number
                    </label>
                    <input
                      id="registered_number"
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
                            width={item.formats?.thumbnail?.width}
                            height={item.formats?.thumbnail?.height}
                            src={item.formats?.thumbnail?.url}
                            alt={item.name}
                            classes="object-cover w-full h-full"
                          />
                        </div>
                      );
                    }
                  })}
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

export default EditPart;
