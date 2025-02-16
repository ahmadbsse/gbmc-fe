import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import showToast from "@/utils/toast";
import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";

import apiClient from "@/utils/apiClient";
import { addMakeValidator } from "@/utils/validators";

import type { AdminAddItemModalProps } from "@/types";

type FormDataTypes = {
  name: string;
  active: boolean;
  media: string | string[];
};

const AdminAddItemModal: React.FC<AdminAddItemModalProps> = ({ onClose, currentTab, getData }) => {
  const initialFormData = {
    name: "",
    active: false,
    media: "",
  } as FormDataTypes;

  const [formData, setFormData] = useState(initialFormData);
  const [dataFilesIds, setDataFilesIds] = useState<string | string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    formData.media = dataFilesIds;
    if (formData.name.trim() === "" || dataFilesIds.length === 0) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [formData, dataFilesIds]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addMakeValidator(formData, dataFilesIds)) {
      formData.media = dataFilesIds;

      try {
        apiClient
          .POST(`/${currentTab}`, { data: formData })
          .then(() => {
            setFormData(initialFormData);
            showToast(`${currentTab} added successfully`, "success");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
        <div className="fixed flex w-full max-w-[560px] items-center justify-between rounded-tl-lg bg-white py-3 pl-6 pr-2">
          <h2 className="text-2xl font-bold">Add New Make</h2>
          <button onClick={onClose} className="">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-3 p-6">
          <div>
            <label className="required mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
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
              setDataFilesIds={setDataFilesIds}
              disabled={dataFilesIds != "" || dataFilesIds.length > 1}
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
          <div className="ml-auto mt-6 w-1/3">
            <BaseButton loading={false} type="submit" disabled={!isFormValid}>
              Save
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddItemModal;
