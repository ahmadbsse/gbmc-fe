import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import showToast from "@/utils/toast";
import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { makeValidator } from "@/utils/validators";
import { uploadFilesRequest, deepEqual, sanitizeText } from "@/utils";
import type { MakeAddModalProps } from "@/types";
import WarningModal from "@/components/admin/WarningModal";

type FormDataTypes = {
  name: string;
  active: boolean;
  media: string | string[];
};

const MakeAddModal: React.FC<MakeAddModalProps> = ({
  setShowAddItemModal,
  currentTab,
  getData,
}) => {
  const initialFormData = {
    name: "",
    active: false,
    media: "",
  } as FormDataTypes;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const deepCopy = structuredClone(initialFormData);
  const setMedia = (media: string | string[]) => {
    setFormData({ ...formData, media });
  };
  useEffect(() => {
    if (formData.name.trim() === "" || formData.media === "") {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [formData]);

  const sanitizedFormData = () => {
    return {
      ...formData,
      name: sanitizeText(formData.name),
    };
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!makeValidator(formData)) {
      showToast("Please fill all required fields", "error", true);
      return;
    }

    try {
      setLoading(true);

      const mediaRes = await uploadFilesRequest(formData.media, false);
      if (mediaRes) {
        formData.media = mediaRes;
      }

      await apiClient.POST(`/${currentTab}`, { data: sanitizedFormData() });

      setFormData(initialFormData);
      const label = currentTab === "suppliers" ? formData.name : currentTab;
      showToast(`${label} added successfully`, "success");

      getData();
      setShowAddItemModal(false);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Something went wrong", "error", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showWarning ? (
        <WarningModal
          onClose={(check: boolean) => {
            if (check) {
              setShowWarning(false);
              setShowAddItemModal(false);
            } else {
              setShowWarning(false);
            }
          }}
          currentTab="suppliers"
          type="create"
        />
      ) : null}

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
          <div className="fixed flex w-full max-w-[560px] items-center justify-between rounded-tl-lg bg-white py-3 pl-6 pr-2">
            <h2 className="text-2xl font-bold">Add New Make</h2>
            <button
              onClick={() => {
                if (deepEqual(deepCopy, formData)) {
                  setShowAddItemModal(false);
                } else {
                  setShowWarning(true);
                }
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-3 p-6 lg:space-y-5">
            <div>
              <label htmlFor="name" className="required mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                maxLength={255}
                type="text"
                title={formData?.name}
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder="Type name"
                value={formData?.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="required mb-1 block text-sm font-medium"> Media</label>
              <BaseFileUploader
                setDataFilesIds={setMedia}
                disabled={formData.media != "" || formData.media.length > 1}
              />
            </div>
            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData?.active}
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
        </div>
      </div>
    </>
  );
};

export default MakeAddModal;
