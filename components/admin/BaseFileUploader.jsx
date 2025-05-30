import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import ImagePreview from "./ImagePreview";

const BaseFileUploader = ({
  setDataFilesIds,
  multiple = false,
  isHero = false,
  disabled = false,
  removeMedia = () => {},
  isPDF = false,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  // File upload handler for multiple files
  const handleFileUpload = async (filesToUpload) => {
    try {
      setDataFilesIds(filesToUpload);
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({
          ...f,
          status: "success",
          progress: 100,
        }))
      );
    } catch (error) {
      console.error(error);
      // Mark all files as failed
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({
          ...f,
          status: "error",
          progress: 0,
        }))
      );
    }
  };
  const imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
  ];
  const videoTypes = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
    "video/mkv",
  ];
  const pdfTypes = ["application/pdf"];


  const isValidFileType = (file) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];
    const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
    const pdfTypes = ['application/pdf'];
    
    return [...imageTypes, ...videoTypes, ...pdfTypes].includes(file.type);
  };
  // Handle file selection
  const handleFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      if ([...imageTypes, ...videoTypes, ...pdfTypes].includes(file.type)) return file;
    });
    if (validFiles.length === 0) {
      alert("Only images and videos are allowed.");
      return;
    }

    const newFiles = validFiles.map((file) => ({
      file,
      name: file.name,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      status: "uploading",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    handleFileUpload(newFiles);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(isValidFileType);

    if (validFiles.length > 0) {
      handleFiles(validFiles);
    }
  };
  // Remove file handler
  const handleRemoveFile = (file) => {
    const updatedFiles = files.filter((f) => f?.preview !== file?.preview);
    setFiles(updatedFiles);
    if (multiple) {
      removeMedia(file);
    } else {
      setDataFilesIds("");
    }
    if (isPDF) {
      removeMedia();
    }
    if(isHero){
      removeMedia();
    }
  };

  return (
    <div className="w-full">
      {previewFile ? (
        <ImagePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      ) : null}
      {/* Upload Area */}
      {disabled ? null : (
        <div
          className={`cursor-pointer rounded-lg border-2 border-dashed bg-white p-8 text-center transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"} ${disabled ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={isPDF ? "application/pdf" : "image/*, video/*"}
            disabled={disabled}
            multiple={multiple}
            className={`hidden`}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* File List */}
      {files.length ? (
        <div className="mt-6 space-y-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow"
            >
              {/* File Preview */}
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full cursor-pointer object-contain"
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

              {/* File Info */}
              <div className="min-w-0 flex-1">
                <p className="max-w-[200px] truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>

                {/* Progress Bar */}
                <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      file.status === "error" ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {file.status === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
                {file.status === "error" && <AlertCircle className="h-6 w-6 text-red-500" />}
                {file.status === "uploading" && (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(file);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default BaseFileUploader;
