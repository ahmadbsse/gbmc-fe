import { X } from "lucide-react";
import Image from "next/image";

const ImagePreview = ({ file, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[200px] w-[200px] overflow-y-auto rounded-lg bg-white">
        <button onClick={onClose} className="absolute right-2 top-2">
          <X className="h-5 w-5 rounded-full bg-black/50 p-1 text-white" />
        </button>
        {file.preview ? (
          <Image
            src={file.preview}
            height={200}
            width={200}
            alt={file.name}
            className="h-full w-full cursor-pointer object-cover"
            onClick={() => {
              setPreviewFile(file);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-xs text-gray-500">No preview</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default ImagePreview;
