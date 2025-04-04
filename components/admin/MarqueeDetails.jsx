import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Trash, Plus } from "lucide-react";
import { BaseButton, BaseLoader } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { ActivateMarquee, CreateMarquee, DeleteModal } from "@/components/admin/marquee";

import showToast from "@/utils/toast";

export default function MarqueeDetails() {
  const [marqueeData, setMarqueeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const url = `/marquee`;

  const getMarqueeText = async () => {
    setIsLoading(true);
    try {
      await apiClient.GET(url).then(async (res) => {
        if (res.data) {
          setMarqueeData(res.data);
        } else {
          setMarqueeData(null);
          console.error("Error fetching marquee text:", res);
        }
      });
    } catch (error) {
      console.error("Error fetching marquee text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivation = async () => {
    const item = marqueeData;
    try {
      const data = JSON.parse(JSON.stringify(item));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;

      data.active = !data.active;

      await apiClient.PUT(url, { data: data }).then((res) => {
        showToast(
          `Marquee ${" "}${data?.active ? "activated" : "deactivated"} successfully`,
          "success"
        );
        setShowActivateModal(null);
        getMarqueeText();
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };

  const deleteItem = async () => {
    try {
      await apiClient
        .DELETE(url)
        .then((res) => {
          setShowDeleteModal(false);
          showToast(`marquee deleted successfully`, "success");
          setMarqueeData(null);
        })
        .catch((error) => {
          showToast(error.message, "error", true);
        });
    } catch (error) {
      showToast(error.message, "error", true);
      console.error("Error updating resource:", error.message);
    }
  };

  useEffect(() => {
    getMarqueeText();
  }, []);
  return (
    <>
      {showActivateModal ? (
        <ActivateMarquee
          handleToggle={toggleActivation}
          status={marqueeData?.active}
          onClose={() => setShowActivateModal(false)}
        />
      ) : null}
      {showAddItemModal ? (
        <CreateMarquee setShowAddItemModal={setShowAddItemModal} getData={getMarqueeText} />
      ) : null}
      {showDeleteModal ? (
        <DeleteModal handleDelete={deleteItem} onClose={() => setShowDeleteModal(false)} />
      ) : null}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center text-xl">
              <span className="font-bold">Marquee Text</span>
            </h2>

            <div className="ml-4 hidden w-fit sm:flex">
              <BaseButton
                loading={false}
                type="submit"
                disabled={marqueeData}
                handleClick={() => setShowAddItemModal(true)}
              >
                <p className="mx-auto flex w-fit gap-2">
                  <Plus className="mt-0.5 h-4 w-4" />
                  Add Marquee
                </p>
              </BaseButton>
            </div>
            <div className={`ml-4 w-fit sm:hidden ${marqueeData ? "cursor-not-allowed" : ""}`}>
              <div
                onClick={() => {
                  if (!marqueeData) {
                    setShowAddItemModal(true);
                  }
                }}
              >
                <Plus className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          {isLoading ? (
            <BaseLoader />
          ) : marqueeData ? (
            <div
              className={`flex w-[265px] flex-col justify-between gap-6 rounded-lg bg-gray-50 p-4 xs:w-[320px] sm:w-full sm:flex-row sm:items-center`}
            >
              {marqueeData?.text}

              <div className="mx-auto flex w-fit items-center gap-3 sm:mx-0 sm:gap-4">
                <i
                  title={marqueeData.active ? "Deactivate" : "Activate"}
                  onClick={() => setShowActivateModal(true)}
                  className={`rounded-lg p-2 ${
                    marqueeData.active
                      ? "bg-green-50 text-green-600 hover:bg-yellow-50"
                      : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                  }`}
                >
                  {marqueeData.active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </i>

                <i
                  title="Delete"
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600"
                >
                  <Trash className="h-4 w-4" />
                </i>
              </div>
            </div>
          ) : (
            <p className="min-h-36 w-fit px-5">No Data Found</p>
          )}
        </div>
      </div>
    </>
  );
}
