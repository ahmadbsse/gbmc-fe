import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useState, useEffect, useMemo } from "react";
import { BaseLoader } from "@/components/common";
import BaseButton from "./BaseButton";
// Dynamically import QuillEditor with error handling for SSR compatibility
const QuillEditor = dynamic(
  () =>
    import("react-quill-new").catch((error) => {
      console.error("Failed to load QuillEditor:", error);
      return null;
    }),
  { ssr: false }
);

const RichTextEditor = ({ onSave, defaultValue = "", label = "Description", readOnly = false }) => {
  // Editor state
  const [value, setValue] = useState(defaultValue);
  const [disabled, setDisabled] = useState(false);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  // Check if QuillEditor is loaded
  useEffect(() => {
    if (QuillEditor) {
      setIsQuillLoaded(true);
    }
  }, []);

  // Update the editor value when defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Memoized editor modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
          ["link"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  // Supported formats for the editor
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
  ];

  const handleSave = () => {
    if (onSave) {
      onSave(value);
      setDisabled(true);
    }
  };

  // Return a fallback UI if QuillEditor fails to load
  if (!isQuillLoaded) {
    return (
      <p className="mx-auto mt-3 w-fit">
        <BaseLoader />
      </p>
    );
  }

  return (
    <div
      className={`rich-text-editor-wrapper ${readOnly ? "pointer-events-none cursor-not-allowed" : ""}`}
    >
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div onClick={() => setDisabled(false)}>
        <QuillEditor
          className="quill-editor"
          theme="snow"
          value={value}
          formats={formats}
          modules={modules}
          onChange={setValue}
          placeholder={`Enter ${label}`}
        />
      </div>
      {!readOnly ? (
        <div className="m-2 ml-auto w-fit">
          <BaseButton
            loading={false}
            btnStyle="primary"
            type="button"
            disabled={disabled}
            handleClick={handleSave}
          >
            Save
          </BaseButton>
        </div>
      ) : null}
    </div>
  );
};

export default RichTextEditor;
