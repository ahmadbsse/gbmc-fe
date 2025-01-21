import React, { useState } from "react";
import { X } from "lucide-react";

import showToast from "@/utils/toast";
import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import type { AdminAddItemModalProps } from "@/types";
import apiClient from "@/utils/apiClient";
import { modifyAdminTabname } from "@/utils";
import { categoryTypeOptions } from "@/data";

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

  const validateForm = () => {
    if (formData.name == "") {
      showToast(`Please enter ${modifyAdminTabname(activeTab)} name`, "error");
      return false;
    }
    if (formData.description == "") {
      showToast(`Please enter ${modifyAdminTabname(activeTab)} description`, "error");
      return false;
    }
    if (currentTab == "categories" && formData.type == "") {
      showToast(`Please select ${modifyAdminTabname(activeTab)} type`, "error");
      return false;
    }
    if (typeof dataFilesIds === "string" && dataFilesIds == "") {
      showToast(`Please upload an image`, "error");
      return false;
    }
    if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
      showToast(`Please upload an image`, "error");
      return false;
    }
    return true;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-3 text-2xl font-bold">Add New {modifyAdminTabname(activeTab)}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter name`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <BaseFileUploader setDataFilesIds={setDataFilesIds} />
          <div className="flex flex-col md:flex-row md:gap-8">
            {currentTab == "categories" ? (
              <div className="basis-1/2">
                <label className="block text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  value={JSON.stringify(formData.type)}
                  onChange={(e) => setFormData({ ...formData, type: JSON.parse(e.target.value) })}
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
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
              />
              <label htmlFor="active" className="text-sm">
                Mark as active
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="basis-1/2">
              <BaseButton loading={false} btnStyle type="button" handleClick={onClose}>
                Cancel
              </BaseButton>
            </div>
            <div className="basis-1/2">
              <BaseButton loading={false} type="submit">
                Add {modifyAdminTabname(activeTab)}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddItemModal;
