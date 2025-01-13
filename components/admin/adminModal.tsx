import React, { useState } from "react";
import { X } from "lucide-react";

import { BaseButton } from "@/components/common";
import type { AdminModalProps } from "@/types";

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, type = "category" }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    featured: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-2xl font-bold">
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter ${type} name`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
              placeholder={`Enter ${type} description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {type === "product" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option value="engine">Engine Parts</option>
                  <option value="transmission">Transmission</option>
                  <option value="hydraulic">Hydraulic Systems</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </>
          )}

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
              <BaseButton
                loading={false}
                id="viewDetailsButton"
                type="submit"
                handleClick={onClose}
              >
                Add {type}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
