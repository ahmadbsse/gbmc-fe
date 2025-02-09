import React, { useState } from "react";
import { X } from "lucide-react";

import showToast from "@/utils/toast";
import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";

import apiClient from "@/utils/apiClient";
import { modifyAdminTabname } from "@/utils";
import { addCategoryAndSupplierValidator } from "@/utils/validators";

import type { AdminAddItemModalProps } from "@/types";

type FormDataTypes = {
  name: string;
  description: string;
  active: boolean;
  media: string | string[];
  type: string;
};

const AdminAddItemModal: React.FC<AdminAddItemModalProps> = ({
  onClose,
  activeTab,
  currentTab,
  getData,
}) => {
  const initialFormData = {
    name: "",
    description: "",
    active: false,
    media: "",
    type: "",
  } as FormDataTypes;

  const [formData, setFormData] = useState(initialFormData);
  const [dataFilesIds, setDataFilesIds] = useState<string | string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addCategoryAndSupplierValidator(formData, currentTab, dataFilesIds)) {
      formData.media = dataFilesIds;
      if (currentTab == "suppliers") {
        delete formData.type;
      }
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
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-8 text-2xl font-bold">Add New {modifyAdminTabname(activeTab)}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="required mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter name`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="required mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full text-ellipsis rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="required mb-1 block text-sm font-medium"> Media</label>
            <BaseFileUploader setDataFilesIds={setDataFilesIds} />
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
          <div className="ml-auto mt-6 w-1/3">
            <BaseButton loading={false} type="submit">
              Save
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddItemModal;
