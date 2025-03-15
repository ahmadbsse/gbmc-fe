import { X } from "lucide-react";
import { useEffect, useState } from "react";

import showToast from "@/utils/toast";
import {
  transformMedia,
  uploadFilesRequest,
  deleteFilesRequest,
  sanitizeText,
  decodeText,
} from "@/utils";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseLoader, BaseImage } from "@/components/common";
import BaseFileUploader from "./BaseFileUploader";
import { makeValidator } from "@/utils/validators";
import WarningModal from "@/components/admin/WarningModal";

const AdminEditItemModal = ({ activeID, setShowEditModal, currentTab, getData }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [idsToRemove, setIdsToRemove] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (formData) {
      if (formData.name === "" || formData.media.length === 0) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    }
  }, [formData]);
  const getMakeDetails = async () => {
    try {
      const url = `/${currentTab}/${activeID}?populate=*`;
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
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  useEffect(() => {
    if (activeID) getMakeDetails();
  }, []);
  const sanitizedFormData = () => {
    return {
      ...formData,
      name: sanitizeText(formData.name),
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (makeValidator(formData)) {
      setLoading(true);
      try {
        await uploadFilesRequest(formData.media, false)
          .then((res) => {
            delete formData.documentId;
            if (res) {
              formData.media = res;
              try {
                apiClient
                  .PUT(`/${currentTab}/${activeID}`, { data: sanitizedFormData() })
                  .then(async () => {
                    showToast(`${formData.name} saved successfully`, "success");
                    await deleteFilesRequest(idsToRemove).then(() => {
                      getData();
                      setShowEditModal(false);
                    });
                  })
                  .catch((error) => {
                    showToast(error.message, "error", true);
                  });
              } catch (error) {
                showToast(error.message, "error", true);
              }
            } else {
              try {
                formData.media = formData.media.id;
                apiClient
                  .PUT(`/${currentTab}/${activeID}`, { data: formData })
                  .then(async () => {
                    showToast(`${formData.name} saved successfully`, "success");
                    await deleteFilesRequest(idsToRemove).then(() => {
                      getData();
                      setShowEditModal(false);
                    });
                  })
                  .catch((error) => {
                    showToast(error.message, "error", true);
                  });
              } catch (error) {
                showToast(error.message, "error", true);
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
  function removeMediaById(idsToRemove) {
    return {
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem.id !== idsToRemove),
    };
  }
  const setMedia = (media) => {
    setFormData({ ...formData, media });
  };
  return (
    <>
      {showWarning ? (
        <WarningModal
          onClose={(check) => {
            if (check) {
              setShowWarning(false);
              setShowEditModal(false);
            } else {
              setShowWarning(false);
            }
          }}
          currentTab="suppliers"
          type="modify"
        />
      ) : null}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
          <div className="fixed flex w-full max-w-[560px] items-center justify-between gap-5 rounded-tl-lg bg-white py-3 pl-6 pr-2">
            <h2 className="truncate text-2xl font-bold">
              Edit Make - <span className="font-medium">{formData?.name || ""}</span>
            </h2>
            <button
              onClick={() => {
                setShowWarning(true);
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {formData ? (
            <form onSubmit={handleSubmit} className="mt-10 space-y-3 p-6 lg:space-y-5">
              <div>
                <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  title={formData.name}
                  maxLength={255}
                  type="text"
                  className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder="Type name"
                  value={formData.name}
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="required mb-1 block text-sm font-medium"> Media</label>
                <BaseFileUploader
                  setDataFilesIds={setMedia}
                  disabled={formData?.media != "" || formData?.media.length > 1}
                />
              </div>
              <div className="flex items-center gap-4">
                {formData?.media ? (
                  Array.isArray(formData?.media) &&
                  formData?.media?.map((item) => {
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
                            classes="object-contain w-full h-full"
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
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                  />
                  <label htmlFor="active" className="text-sm">
                    Mark as active
                  </label>
                </div>
              </div>
              <div className="ml-auto mt-6 flex w-fit gap-4">
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
    </>
  );
};

export default AdminEditItemModal;
