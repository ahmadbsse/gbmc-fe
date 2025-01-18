import { Folder, Eye, EyeOff, Star, Pencil, Trash, Plus } from "lucide-react";
import { useState } from "react";

import { AdminModal } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { BaseButton } from "@/components/common";

const ListCategories = ({ data, activeTab, getDate }) => {
  const [showModal, setShowModal] = useState(false);
  const currentTab = activeTab.key == "engineering" ? "engineering-components" : activeTab.key;

  const toggleActivation = async (category) => {
    try {
      const url = `/${currentTab}/${category.documentId}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(category));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      data.active = !data.active;

      await apiClient.PUT(url, { data: data }).then((res) => {
        getDate();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  const toggleFeatured = async (category) => {
    try {
      const url = `/${currentTab}/${category.documentId}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(category));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      data.featured = !data.featured;

      await apiClient.PUT(url, { data: data }).then((res) => {
        getDate();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  const modifyTypeName = (name) => {
    return name.replace("_", " ");
  };
  return (
    <>
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        activeTab={activeTab}
        type="product"
        currentTab={currentTab}
        getDate={getDate}
      />
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-medium">{activeTab.name}</h2>
            <div className="w-fit">
              <BaseButton
                loading={false}
                id="viewDetailsButton"
                type="submit"
                handleClick={() => {
                  setShowModal(true);
                }}
              >
                <p className="mx-auto flex w-fit px-3">
                  <Plus className="mt-0.5 h-4 w-4" />
                  Add New
                </p>
              </BaseButton>
            </div>
          </div>
        </div>
        <div className="p-6">
          {data && data.length > 0 ? (
            <div className="grid gap-4">
              {data &&
                data.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Folder className="h-5 w-5" />
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <span className="text-sm capitalize">{modifyTypeName(category.type)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <i
                        onClick={() => toggleActivation(category)}
                        className={`rounded-lg p-2 ${
                          category.active
                            ? "bg-green-50 text-green-600 hover:bg-yellow-50"
                            : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                        }`}
                      >
                        {category.active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </i>
                      <i
                        className={`rounded-lg p-2 ${
                          category.featured
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                            : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                        }`}
                        onClick={() => toggleFeatured(category)}
                      >
                        <Star className="h-4 w-4" />
                      </i>
                      <i
                        className={`rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600`}
                      >
                        <Pencil className="h-4 w-4" />
                      </i>
                      <i className="rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600">
                        <Trash className="h-4 w-4" />
                      </i>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="mx-auto w-fit">No Data Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListCategories;
