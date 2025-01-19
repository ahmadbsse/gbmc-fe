import { X } from "lucide-react";
import { BaseButton } from "@/components/common";

const DeleteConfirmationModal = ({ isOpen, onClose, handleDelete }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[500px] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Delete Item</h1>
        <h2 className="mb-6">Are you sure you want to delete this item?</h2>
        <div className="ml-auto mt-6 flex w-[300px] gap-4">
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
              type="button"
              handleClick={handleDelete}
            >
              Delete Item
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
