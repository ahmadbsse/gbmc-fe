import { X } from "lucide-react";
import { useEffect, useState } from "react";

import showToast from "@/utils/toast";
import { transformMedia, modifyAdminTabname } from "@/utils";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseLoader, BaseImage } from "@/components/common";
import BaseFileUploader from "./BaseFileUploader";
import { categoryTypeOptions } from "@/data";

const AdminEditItemModal = ({ activeTab, activeID, onClose, currentTab, getData }) => {
  const [data, setData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);

  const getCategoryDetails = async () => {
    try {
      const url = `/${currentTab}/${activeID}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const respose = transformMedia(res.data);
        delete respose.id;
        delete respose.updatedAt;
        delete respose.createdAt;
        delete respose.publishedAt;
        if (!Array.isArray(respose.media)) {
          respose.media = [respose.media];
        }
        setData(respose);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  useEffect(() => {
    if (activeID) getCategoryDetails();
  }, []);
  const validateForm = () => {
    if (data.name == "") {
      showToast(`Please enter ${modifyAdminTabname(activeTab)} name`, "error");
      return false;
    }
    if (data.description == "") {
      showToast(`Please enter ${modifyAdminTabname(activeTab)} description`, "error");
      return false;
    }
    if (currentTab == "categories" && data.type == "") {
      showToast(`Please select ${modifyAdminTabname(activeTab)} type`, "error");
      return false;
    }
    if (typeof dataFilesIds === "string" && data.media.length == 0 && dataFilesIds == "") {
      showToast(`Please upload an image`, "error");
      return false;
    }
    if (typeof dataFilesIds === "object" && data.media.length == 0 && dataFilesIds.length == 0) {
      showToast(`Please upload an image`, "error");
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (dataFilesIds.length == 0) {
        if (Array.isArray(data.media)) {
          data.media = data.media.map((item) => item.id);
        } else {
          data.media = data.media.id;
        }
      } else {
        data.media = [...data.media.map((item) => item.id), ...dataFilesIds];
      }
      delete data.documentId;
      try {
        apiClient
          .PUT(`/${currentTab}/${activeID}`, { data: data })
          .then(() => {
            showToast(`${currentTab} edited successfully`, "success");
            getData();
            onClose(e);
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
  };
  const deletePreviousImage = async (id) => {
    try {
      await apiClient.DELETE(`/upload/files/${id}`).then((res) => {
        setData(removeMediaById(id));
      });
    } catch (error) {
      console.error("Error deleting resource:", error.message);
    }
  };
  function removeMediaById(idToRemove) {
    return { ...data, media: data?.media?.filter((mediaItem) => mediaItem.id !== idToRemove) };
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-3 text-2xl font-bold">
          Edit {modifyAdminTabname(activeTab)} - {data?.name}
        </h2>
        {data ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder={`Enter ${activeTab} name`}
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder={`Enter ${activeTab} description`}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>
            <BaseFileUploader setDataFilesIds={setDataFilesIds} />
            <div className="flex items-center gap-4">
              {data?.media?.map((item) => (
                <div className="relative w-44" key={item.documentId}>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      deletePreviousImage(item.id);
                    }}
                    className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <BaseImage
                    width={item.formats.thumbnail.width}
                    height={item.formats.thumbnail.height}
                    src={item.formats.thumbnail.url}
                    alt={item.name}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row md:gap-8">
              {currentTab == "categories" ? (
                <div className="basis-1/2">
                  <label className="block text-sm font-medium">Category</label>

                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    value={JSON.stringify(data.type)}
                    onChange={(e) => setData({ ...data, type: JSON.parse(e.target.value) })}
                  >
                    <option value="">Select a category</option>
                    {categoryTypeOptions.map((option) => (
                      <option key={option.value} value={JSON.stringify(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={data.active}
                  onChange={(e) => setData({ ...data, active: e.target.checked })}
                  className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-sm">
                  Mark as active
                </label>
              </div>
              {activeTab.key !== "categories" && activeTab.key !== "suppliers" ? (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={data.featured}
                    onChange={(e) => setData({ ...data, featured: e.target.checked })}
                    className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </label>
                </div>
              ) : null}
            </div>
            <div className="mt-6 flex gap-4">
              <div className="basis-1/2">
                <BaseButton loading={false} btnStyle type="button" handleClick={onClose}>
                  Cancel
                </BaseButton>
              </div>
              <div className="basis-1/2">
                <BaseButton loading={false} type="submit">
                  Edit {modifyAdminTabname(activeTab)}
                </BaseButton>
              </div>
            </div>
          </form>
        ) : (
          <p>
            <BaseLoader />
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminEditItemModal;
