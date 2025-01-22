import { Eye, EyeOff, Star, Pencil, Trash, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";

import showToast from "@/utils/toast";
import { AdminAddItemModal, DeleteConfirmationModal, AdminEditItemModal } from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseImage } from "@/components/common";
import { convertToReadableDate } from "@/utils";

const ListDashboardData = ({ data, activeTab, getData }) => {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeID, setActiveID] = useState(null);
  const currentTab = activeTab.key == "engineering" ? "engineering-components" : activeTab.key;
  const router = useRouter();

  const toggleActivation = async (item) => {
    try {
      const url = `/${currentTab}/${item.documentId}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(item));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      if (Array.isArray(data.media)) {
        data.media = data.media.map((item) => item.id);
      } else {
        data.media = data.media.id;
      }
      data.active = !data.active;
      await apiClient.PUT(url, { data: data }).then((res) => {
        showToast(`${data.active ? "activated" : "deactivated"} successfully`, "success");
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
      if (Array.isArray(data.media)) {
        data.media = data.media.map((item) => item.id);
      } else {
        data.media = data.media.id;
      }
      data.featured = !data.featured;

      await apiClient
        .PUT(url, { data: data })
        .then((res) => {
          showToast(`${!data.featured ? "unfeatured" : "featured"} successfully`, "success");
          getData();
        })
        .catch((error) => {
          showToast(error.message, "error");
          console.error(error.message);
        });
    } catch (error) {
      showToast(error.message, "error");
      console.error("Error updating resource:", error.message);
    }
  };
  const deleteItem = async () => {
    try {
      const url = `/${currentTab}/${activeID}`;
      await apiClient
        .DELETE(url)
        .then((res) => {
          setShowDeleteModal(false);
          showToast(`deleted succussfully`, "success");
          setActiveID(null);
          getData();
        })
        .catch((error) => {
          console.log(error);
          showToast(error.message, "error");
        });
    } catch (error) {
      showToast(error.message, "error");
      console.error("Error updating resource:", error.message);
    }
  };
  const addNewItem = () => {
    if (currentTab == "categories" || currentTab == "suppliers") {
      setShowAddItemModal(true);
    }
    if (
      currentTab == "parts" ||
      currentTab == "sub-assemblies" ||
      currentTab == "engineering-components"
    ) {
      router.push(`/admin/${currentTab}/create`);
    }
  };
  const viewDetails = (documentId) => {
    if (
      currentTab == "parts" ||
      currentTab == "sub-assemblies" ||
      currentTab == "engineering-components"
    ) {
      router.push(`/admin/${currentTab}/detail?id=${documentId}`);
    }
  };
  return (
    <>
      {showAddItemModal ? (
        <AdminAddItemModal
          onClose={() => setShowAddItemModal(false)}
          activeTab={activeTab}
          type="product"
          currentTab={currentTab}
          getData={getData}
        />
      ) : null}
      {showDeleteModal ? (
        <DeleteConfirmationModal
          handleDelete={deleteItem}
          currentTab={currentTab}
          onClose={() => setShowDeleteModal(false)}
        />
      ) : null}
      {showEditModal ? (
        <AdminEditItemModal
          activeTab={activeTab}
          activeID={activeID}
          currentTab={currentTab}
          onClose={() => setShowEditModal(false)}
          getData={getData}
        />
      ) : null}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-medium">{activeTab.name}</h2>
            <div className="hidden w-fit md:flex">
              <BaseButton loading={false} type="submit" handleClick={addNewItem}>
                <p className="mx-auto flex w-fit md:px-3">
                  <Plus className="mt-0.5 h-4 w-4" />
                  Add New
                </p>
              </BaseButton>
            </div>
            <div className="mg:hidden w-fit">
              <div onClick={addNewItem}>
                <Plus className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-6">
          {data && data.length > 0 ? (
            <div className="grid gap-4">
              {data &&
                data.map((item, index) => (
                  <div
                    key={item.documentId}
                    className={`flex flex-col justify-between rounded-lg bg-gray-50 p-4 md:flex-row md:items-center`}
                  >
                    <div className="flex gap-4">
                      <span>{index + 1}.</span>
                      <div className="hidden max-w-44 md:block">
                        {Array.isArray(item?.media) ? (
                          <BaseImage
                            width={item.media[0]?.formats.thumbnail.width}
                            height={item.media[0]?.formats.thumbnail.height}
                            src={item.media[0]?.formats.thumbnail.url}
                            alt={item.name}
                            priority={true}
                          />
                        ) : (
                          <BaseImage
                            width={item.media?.formats.thumbnail.width}
                            height={item.media?.formats.thumbnail.height}
                            src={item.media?.formats.thumbnail.url}
                            alt={item.name}
                            priority={true}
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3
                            onClick={() => viewDetails(item.documentId)}
                            className={`font-medium capitalize ${currentTab == "parts" || currentTab == "sub-assemblies" || currentTab == "engineering-components" ? "cursor-pointer" : ""}`}
                          >
                            {item.name}
                          </h3>
                          {currentTab == "parts" ||
                          currentTab == "sub-assemblies" ||
                          currentTab == "engineering-components" ? null : (
                            <span className="text-sm">{item.description}</span>
                          )}
                        </div>
                        <span className="text-xs text-solidGray/50">
                          {convertToReadableDate(item.publishedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="ml-auto mt-2 flex w-fit items-center gap-2 md:ml-0 md:mt-0 md:gap-4">
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
                      {currentTab != "categories" && currentTab != "suppliers" ? (
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
                        onClick={() => {
                          if (
                            currentTab == "parts" ||
                            currentTab == "sub-assemblies" ||
                            currentTab == "engineering-components"
                          ) {
                            router.push(`/admin/${currentTab}/edit?id=${item.documentId}`);
                          } else {
                            setActiveID(item.documentId);
                            setShowEditModal(true);
                          }
                        }}
                        className={`rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600`}
                      >
                        <Pencil className="h-4 w-4" />
                      </i>
                      <i
                        onClick={() => {
                          setActiveID(item.documentId);
                          setShowDeleteModal(true);
                        }}
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
