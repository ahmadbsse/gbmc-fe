import React, { useState } from "react";
import { X } from "lucide-react";

import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import type { AdminAddItemModalProps } from "@/types";
import apiClient from "@/utils/apiClient";
import { modifyAdminTabname } from "@/utils";
import { categoryTypeOptions } from "@/data";

const AdminAddItemModal: React.FC<AdminAddItemModalProps> = ({
  onClose,
  activeTab,
  currentTab,
  getData,
}) => {
  const initialFormData = {
    name: "",
    description: "",
    type: "",
    active: false,
    featured: false,
    media: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [dataFilesIds, setDataFilesIds] = useState<string | string[]>([]);

  const validateForm = () => {
    if (formData.name == "") {
      setError(`Please enter ${modifyAdminTabname(activeTab)} name`);
      return false;
    }
    if (formData.description == "") {
      setError(`Please enter ${modifyAdminTabname(activeTab)} description`);
      return false;
    }
    if (formData.type == "") {
      setError(`Please select ${modifyAdminTabname(activeTab)} type`);
      return false;
    }
    if (typeof dataFilesIds === "string" && dataFilesIds == "") {
      setError(`Please upload an image`);
      return false;
    }
    if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
      setError(`Please upload an image`);
      return false;
    }
    delete formData.featured;
    return true;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      formData.media = dataFilesIds;
      try {
        apiClient
          .POST(`/${currentTab}`, { data: formData })
          .then(() => {
            setFormData(initialFormData);
            getData();
            onClose(e);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[600px] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-4 text-2xl font-bold">Add New {modifyAdminTabname(activeTab)}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter ${formData.type} name`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter ${formData.type} description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <BaseFileUploader setDataFilesIds={setDataFilesIds} />
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="basis-1/2">
              <label className="mb-1 block text-sm font-medium">Category</label>
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
            {activeTab.key !== "categories" ? (
              <div className="mt-4 flex items-center gap-2">
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
            ) : null}
          </div>
          <p className="mx-auto w-fit text-sm capitalize text-error">{error}</p>
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
