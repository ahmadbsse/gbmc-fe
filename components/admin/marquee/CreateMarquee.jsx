import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import showToast from "@/utils/toast";
import { BaseButton } from "@/components/common";
import apiClient from "@/utils/apiClient";
import { marqueeValidator } from "@/utils/validators";
import { deepEqual, sanitizeText } from "@/utils";
import WarningModal from "@/components/admin/WarningModal";

const CreateMarquee = ({ setShowAddItemModal, getData }) => {
  const initialFormData = {
    text: "",
    active: false,
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const deepCopy = structuredClone(initialFormData);

  useEffect(() => {
    if (formData.text.trim() === "") {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [formData]);

  const sanitizedFormData = () => {
    return {
      ...formData,
      text: sanitizeText(formData.text),
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (marqueeValidator(formData)) {
      setLoading(true);

      try {
        apiClient
          .PUT(`/marquee`, { data: sanitizedFormData() })
          .then(() => {
            setFormData(initialFormData);
            showToast(`marquee added successfully`, "success");
            getData();
            setShowAddItemModal(false);
          })
          .catch((error) => {
            showToast(error.message, "error", true);
          });
      } catch (error) {
        showToast(error.message, "error", true);
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Please fill all required fields", "error", true);
    }
  };

  return (
    <>
      {showWarning ? (
        <WarningModal
          onClose={(check) => {
            if (check) {
              setShowWarning(false);
              setShowAddItemModal(false);
            } else {
              setShowWarning(false);
            }
          }}
          currentTab="Marquee"
          type="create"
        />
      ) : null}

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
          <div className="fixed flex w-full max-w-[560px] items-center justify-between rounded-tl-lg bg-white py-3 pl-6 pr-2">
            <h2 className="text-2xl font-bold">Add New Marquee</h2>
            <button
              onClick={() => {
                if (deepEqual(deepCopy, formData)) {
                  setShowAddItemModal(false);
                } else {
                  setShowWarning(true);
                }
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-3 p-6 lg:space-y-5">
            <div>
              <label htmlFor="text" className="required mb-1 block text-sm font-medium">
                Text
              </label>
              <input
                id="text"
                maxLength={255}
                type="text"
                title={formData?.text}
                className="w-full text-ellipsis rounded-lg border border-gray-300 px-2.5 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                placeholder="Marquee Text"
                value={formData?.text}
                required
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>

            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData?.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-sm">
                  Mark as active
                </label>
              </div>
            </div>
            <div className="ml-auto mt-6 flex w-fit gap-4">
              <BaseButton loading={loading} type="submit" disabled={!isFormValid}>
                Save
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateMarquee;
