import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect, useMemo } from "react";

import BaseButton from "./BaseButton";

// Dynamically import QuillEditor for SSR compatibility
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({ onSave, defaultValue = "", label = "Description", readOnly = false }) => {
  // Editor state
  const [value, setValue] = useState(defaultValue);
  const [disabled, setDisabled] = useState(false);
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
    "bullet",
    "indent",
    "link",
  ];

  const handleSave = () => {
    if (onSave) {
      onSave(value);
      setDisabled(true);
    }
  };
  if (!QuillEditor) return null;
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
