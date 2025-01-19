import { Eye, EyeOff, Star, Pencil, Trash, Plus } from "lucide-react";
import { useState } from "react";

import { AdminModal } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseImage } from "@/components/common";
import { convertToReadableDate } from "@/utils";

const ListDashboardData = ({ data, activeTab, getData }) => {
  const [showModal, setShowModal] = useState(false);
  const currentTab = activeTab.key == "engineering" ? "engineering-components" : activeTab.key;

  const toggleActivation = async (item) => {
    try {
      const url = `/${currentTab}/${item.documentId}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(item));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      data.active = !data.active;

      await apiClient.PUT(url, { data: data }).then((res) => {
        getData();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  const toggleFeatured = async (item) => {
    try {
      const url = `/${currentTab}/${item.documentId}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(item));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      data.featured = !data.featured;

      await apiClient.PUT(url, { data: data }).then((res) => {
        getData();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  const deleteItem = async (itemId) => {
    try {
      const url = `/${currentTab}/${itemId}`;
      await apiClient.DELETE(url).then((res) => {
        getData();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };

  return (
    <>
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        activeTab={activeTab}
        type="product"
        currentTab={currentTab}
        getData={getData}
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
                data.map((item, index) => (
                  <div
                    key={item.documentId}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex gap-4">
                      <span>{index + 1}.</span>
                      <div className="w-44">
                        <BaseImage
                          width={item.media.formats.thumbnail.width}
                          height={item.media.formats.thumbnail.height}
                          src={item.media.formats.thumbnail.url}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium capitalize">{item.name}</h3>
                          <span className="text-sm">{item.description}</span>
                        </div>
                        <span className="text-xs text-solidGray/50">
                          {convertToReadableDate(item.publishedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <i
                        onClick={() => toggleActivation(item)}
                        className={`rounded-lg p-2 ${
                          item.active
                            ? "bg-green-50 text-green-600 hover:bg-yellow-50"
                            : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                        }`}
                      >
                        {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </i>
                      {currentTab != "categories" ? (
                        <i
                          className={`rounded-lg p-2 ${
                            item.featured
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                              : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                          }`}
                          onClick={() => toggleFeatured(item)}
                        >
                          <Star className="h-4 w-4" />
                        </i>
                      ) : null}
                      <i
                        className={`rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600`}
                      >
                        <Pencil className="h-4 w-4" />
                      </i>
                      <i
                        onClick={() => deleteItem(item.documentId)}
                        className="rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600"
                      >
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

export default ListDashboardData;
