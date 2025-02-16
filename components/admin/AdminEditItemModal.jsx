import { X } from "lucide-react";
import { useEffect, useState } from "react";

import showToast from "@/utils/toast";
import { transformMedia, uploadFilesRequest, deleteFilesRequest } from "@/utils";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseLoader, BaseImage } from "@/components/common";
import BaseFileUploader from "./BaseFileUploader";
import { makeValidator } from "@/utils/validators";

const AdminEditItemModal = ({ activeID, onClose, currentTab, getData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [idsToRemove, setIdsToRemove] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.name === "" || data.media.length === 0) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [data]);
  const getMakeDetails = async () => {
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
    if (activeID) getMakeDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (makeValidator(data)) {
      setLoading(true);
      try {
        await uploadFilesRequest(data.media, false)
          .then((res) => {
            if (res) {
              data.media = res;
              delete data.documentId;
              try {
                apiClient
                  .PUT(`/${currentTab}/${activeID}`, { data: data })
                  .then(async () => {
                    showToast(`Make saved successfully`, "success");
                    await deleteFilesRequest(idsToRemove).then(() => {
                      console.log("Files deleted successfully");
                      getData();
                      onClose(e);
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
    setData(removeMediaById(id));
    setIdsToRemove([...idsToRemove, id]);
  };
  function removeMediaById(idsToRemove) {
    return { ...data, media: data?.media?.filter((mediaItem) => mediaItem.id !== idsToRemove) };
  }
  const setMedia = (media) => {
    setData({ ...data, media });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
        <div className="fixed flex w-full max-w-[560px] items-center justify-between rounded-tl-lg bg-white py-3 pl-6 pr-2">
          <h2 className="text-2xl font-bold"> Edit Make - {data?.name}</h2>
          <button onClick={onClose} className="">
            <X className="h-6 w-6" />
          </button>
        </div>
        {data ? (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4 p-6">
            <div>
              <label className="required mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder="Type name"
                value={data.name}
                required
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div>
              <label className="required mb-1 block text-sm font-medium"> Media</label>
              <BaseFileUploader
                setDataFilesIds={setMedia}
                disabled={data?.media != "" || data?.media.length > 1}
              />
            </div>
            <div className="flex items-center gap-4">
              {data?.media ? (
                Array.isArray(data?.media) &&
                data?.media?.map((item) => {
                  if (item && item.formats) {
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
                })
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
              <BaseButton loading={loading} type="submit" disabled={!isFormValid}>
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
