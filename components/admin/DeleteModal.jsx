import { X } from "lucide-react";
import { BaseButton } from "@/components/common";

const DeleteConfirmationModal = ({ onClose, handleDelete, name, currentTab }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[500px] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-4 top-6">
          <X className="h-6 w-6" />
        </button>
        <h1 className="mb-2 text-lg font-bold">Confirm</h1>
        <h2 className="mb-16">
          Are you sure you want to delete <strong>{name} </strong>
          {currentTab == "engineering-components"
            ? "Engineering Component"
            : currentTab == "suppliers"
              ? "Make"
              : currentTab == "sub-assemblies"
                ? "Sub Assembly"
                : "Part"}
          ?
        </h2>
        <div className="ml-auto mt-6 flex w-fit">
          <BaseButton loading={false} type="button" handleClick={handleDelete}>
            Delete
          </BaseButton>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
