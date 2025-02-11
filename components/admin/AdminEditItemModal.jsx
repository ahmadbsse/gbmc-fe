import { X } from "lucide-react";
import { useEffect, useState } from "react";

import showToast from "@/utils/toast";
import { transformMedia, modifyAdminTabname } from "@/utils";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseLoader, BaseImage } from "@/components/common";
import BaseFileUploader from "./BaseFileUploader";
import { editCategoryAndSupplierValidator } from "@/utils/validators";

const AdminEditItemModal = ({ activeTab, activeID, onClose, currentTab, getData }) => {
  const [data, setData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (data) {
      if (
        data.name === "" ||
        data.description === "" ||
        (dataFilesIds.length === 0 && data.media.length === 0)
      ) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [data, dataFilesIds]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCategoryAndSupplierValidator(data, currentTab, dataFilesIds)) {
      console.log(dataFilesIds);
      if (dataFilesIds.length == 0) {
        if (Array.isArray(data.media)) {
          data.media = data.media.map((item) => item.id);
        } else {
          data.media = data.media.id;
        }
      } else {
        data.media = [...data.media.map((item) => item.id), dataFilesIds];
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
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-8 text-2xl font-bold">
          Edit {modifyAdminTabname(activeTab)} - {data?.name}
        </h2>
        {data ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="required mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder={`Enter name`}
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div>
              <label className="required mb-1 block text-sm font-medium">Description</label>
              <textarea
                rows={3}
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder={`Enter description`}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>
            <div>
              <label className="required mb-1 block text-sm font-medium"> Media</label>
              <BaseFileUploader
                setDataFilesIds={setDataFilesIds}
                disabled={dataFilesIds != "" || dataFilesIds.length > 1 || data.media.length}
              />
            </div>
            <div className="flex items-center gap-4">
              {data?.media ? (
                data?.media?.map((item) => (
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
                      width={item.formats.thumbnail.width}
                      height={item.formats.thumbnail.height}
                      src={item.formats.thumbnail.url}
                      alt={item.name}
                      classes="object-cover w-full h-full"
                    />
                  </div>
                ))
              ) : (
                <div className="relative h-32 w-44"></div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:gap-8">
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
            </div>
            <div className="ml-auto mt-6 w-1/3">
              <BaseButton loading={false} type="submit" disabled={!isFormValid}>
                Save
              </BaseButton>
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
