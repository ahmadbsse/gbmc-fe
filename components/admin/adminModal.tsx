import React, { useState } from "react";
import { X } from "lucide-react";

import { BaseButton } from "@/components/common";
import type { AdminModalProps } from "@/types";
import apiClient from "@/utils/apiClient";

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
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
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  if (!isOpen) return null;
  const validateForm = () => {
    if (currentTab == "categories") {
      if (formData.name == "") {
        setError(`Please enter ${modifyTabname()} name`);
        return false;
      }
      if (formData.description == "") {
        setError(`Please enter ${modifyTabname()} description`);
        return false;
      }
      if (formData.type == "") {
        setError(`Please select ${modifyTabname()} type`);
        return false;
      }
      return true;
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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
  const modifyTabname = () => {
    return activeTab.name == "Parts"
      ? "Part"
      : activeTab.name == "Engineering"
        ? "Component"
        : "Category";
  };
  const categoryTypeOptions = [
    { label: "Tractors", value: "tractors" },
    { label: "Tractor Parts", value: "tractor_parts" },
    { label: "Sub Assemblies", value: "sub_assemblies" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-2xl font-bold">Add New {modifyTabname()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
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
          <p className="mx-auto w-fit text-sm capitalize text-error">{error}</p>
          <div className="mt-6 flex gap-4">
            <div className="basis-1/2">
              <BaseButton
                loading={false}
                id="viewDetailsButton"
                btnStyle
                type="button"
                handleClick={onClose}
              >
                Cancel
              </BaseButton>
            </div>
            <div className="basis-1/2">
              <BaseButton loading={false} id="viewDetailsButton" type="submit">
                Add {modifyTabname()}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
