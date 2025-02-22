import { Eye, EyeOff, Star, Pencil, Trash, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";

import showToast from "@/utils/toast";
import {
  AdminAddItemModal,
  DeleteConfirmationModal,
  AdminEditItemModal,
  FeatureConfirmationModal,
  ActiveConfirmationModal,
} from "@/components/admin";
import apiClient from "@/utils/apiClient";
import { BaseButton, BaseImage } from "@/components/common";
// import { convertToReadableDate } from "@/utils";

const ListDashboardData = ({ data, activeTab, getData, total, setData }) => {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeID, setActiveID] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const currentTab = activeTab.key == "engineering" ? "engineering-components" : activeTab.key;
  const router = useRouter();

  const toggleActivation = async () => {
    const item = activeItem;
    try {
      const url = `/${currentTab}/${item.documentId}`;
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
      if (currentTab == "parts") {
        data.supplier = data.supplier.id;
      }
      if (currentTab == "engineering-components") {
        data.hero_image = data.hero_image.id;
      }
      await apiClient.PUT(url, { data: data }).then((res) => {
        console.log(data);
        showToast(
          `${data.name} ${" "}${data?.active ? "activated" : "deactivated"} successfully`,
          "success"
        );
        setActiveItem(null);
        getData();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  const toggleFeatured = async () => {
    const item = activeItem;
    try {
      const url = `/${currentTab}/${item.documentId}`;
      const data = JSON.parse(JSON.stringify(item));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      if (currentTab == "parts") {
        data.supplier = data.supplier.id;
      }
      if (currentTab == "engineering-components") {
        data.hero_image = data.hero_image.id;
      }
      if (Array.isArray(data.media)) {
        data.media = data.media.map((item) => item.id);
      } else {
        data.media = data.media.id;
      }
      data.featured = !data.featured;

      await apiClient
        .PUT(url, { data: data })
        .then((res) => {
          showToast(
            `${data.name} ${" "}${!data.featured ? "unfeatured" : "featured"} successfully`,
            "success"
          );
          setActiveItem(null);
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
          showToast(`${activeItem.name} ${" "}deleted succussfully`, "success");
          setActiveID(null);
          setActiveItem(null);
          if (data.length == 1) {
            setData([]);
          }
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
    if (currentTab == "suppliers") {
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
          setShowAddItemModal={setShowAddItemModal}
          type="product"
          currentTab={currentTab}
          getData={getData}
        />
      ) : null}
      {showEditModal ? (
        <AdminEditItemModal
          activeID={activeID}
          currentTab={currentTab}
          setShowEditModal={setShowEditModal}
          getData={getData}
        />
      ) : null}
      {showDeleteModal ? (
        <DeleteConfirmationModal
          handleDelete={deleteItem}
          name={activeItem?.name}
          currentTab={currentTab}
          onClose={() => setShowDeleteModal(false)}
        />
      ) : null}
      {showActiveModal ? (
        <ActiveConfirmationModal
          handleToggle={toggleActivation}
          status={activeItem?.active}
          name={activeItem?.name}
          currentTab={currentTab}
          onClose={() => setShowActiveModal(false)}
        />
      ) : null}
      {showFeatureModal ? (
        <FeatureConfirmationModal
          handleToggle={toggleFeatured}
          status={activeItem?.featured}
          name={activeItem?.name}
          currentTab={currentTab}
          onClose={() => setShowFeatureModal(false)}
        />
      ) : null}

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center text-lg">
              <span className="font-bold">{activeTab.name}</span>
              {total > 0 ? <span> ({total})</span> : null}
            </h2>
            <div className="hidden w-fit sm:flex">
              <BaseButton loading={false} type="submit" handleClick={addNewItem}>
                <p className="mx-auto flex w-fit gap-2">
                  <Plus className="mt-0.5 h-4 w-4" />
                  Add {activeTab?.tag}
                </p>
              </BaseButton>
            </div>
            <div className="w-fit sm:hidden">
              <div onClick={addNewItem}>
                <Plus className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          {data && data.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {data &&
                data.map((item, index) => (
                  <div
                    key={item.documentId}
                    className={`flex flex-col justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center`}
                  >
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                      <div
                        className={`h-32 w-40 min-w-44 max-w-44 ${currentTab == "parts" || currentTab == "sub-assemblies" || currentTab == "engineering-components" ? "cursor-pointer" : ""}`}
                        onClick={() => viewDetails(item.documentId)}
                      >
                        {item.media ? (
                          Array.isArray(item.media) ? (
                            <BaseImage
                              width={item.media[0]?.formats?.thumbnail?.width || 160}
                              height={item.media[0]?.formats?.thumbnail?.height || 112}
                              src={item?.media[0]?.formats.thumbnail?.url || "/placeholder"}
                              alt={item?.name}
                              priority={true}
                              classes="object-fill w-full h-full"
                            />
                          ) : (
                            <BaseImage
                              width={item.media?.formats?.thumbnail?.width || 160}
                              height={item.media?.formats?.thumbnail?.height || 112}
                              src={item?.media?.formats.thumbnail?.url || "/placeholder"}
                              alt={item?.name}
                              priority={true}
                              classes="object-fill w-full h-full"
                            />
                          )
                        ) : null}
                      </div>
                      <h3
                        onClick={() => viewDetails(item.documentId)}
                        className={`text-sm font-bold sm:text-base ${currentTab == "parts" || currentTab == "sub-assemblies" || currentTab == "engineering-components" ? "cursor-pointer" : ""}`}
                      >
                        {item.name}
                      </h3>
                    </div>

                    <div className="mx-auto flex w-fit items-center gap-3 sm:mx-0 sm:gap-4">
                      <i
                        title={item.active ? "Deactivate" : "Activate"}
                        onClick={() => {
                          setActiveItem(item);
                          setShowActiveModal(true);
                        }}
                        className={`rounded-lg p-2 ${
                          item.active
                            ? "bg-green-50 text-green-600 hover:bg-yellow-50"
                            : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                        }`}
                      >
                        {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </i>
                      {currentTab != "suppliers" ? (
                        <i
                          title={item.featured ? "Unfeature" : "Feature"}
                          className={`rounded-lg p-2 ${
                            item.featured
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                              : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                          }`}
                          onClick={() => {
                            setActiveItem(item);
                            setShowFeatureModal(true);
                          }}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={item.featured ? "currentColor" : "#fff"}
                          />
                        </i>
                      ) : null}
                      <i
                        title="Edit"
                        onClick={() => {
                          if (
                            currentTab == "parts" ||
                            currentTab == "sub-assemblies" ||
                            currentTab == "engineering-components"
                          ) {
                            router.push(`/admin/${currentTab}/edit?id=${item.documentId}`);
                          } else {
                            setActiveID(item.documentId);
                            setActiveItem(item);
                            setShowEditModal(true);
                          }
                        }}
                        className={`rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600`}
                      >
                        <Pencil className="h-4 w-4" />
                      </i>
                      <i
                        title="Delete"
                        onClick={() => {
                          setActiveID(item.documentId);
                          setActiveItem(item);
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
            <p className="min-h-36 w-fit px-5">No Data Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListDashboardData;
