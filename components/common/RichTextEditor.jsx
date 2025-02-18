import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useState, useEffect, useMemo } from "react";
import { BaseLoader } from "@/components/common";

// Dynamically import QuillEditor with error handling for SSR compatibility
const QuillEditor = dynamic(
  () =>
    import("react-quill-new").catch((error) => {
      console.error("Failed to load QuillEditor:", error);
      return null;
    }),
  { ssr: false }
);

const RichTextEditor = ({ handleChange, defaultValue, label = "Description" }) => {
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  useEffect(() => {
    if (QuillEditor) {
      setIsQuillLoaded(true);
    }
  }, []);

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

  // Return a fallback UI if QuillEditor fails to load
  if (!isQuillLoaded) {
    return (
      <p className="mx-auto mt-3 w-fit">
        <BaseLoader />
      </p>
    );
  }

  return (
    <div className={`rich-text-editor-wrapper`}>
      <label className="required mb-1 block text-sm font-medium">{label}</label>
      <div>
        <QuillEditor
          className="quill-editor rounded-lg bg-white"
          theme="snow"
          value={defaultValue}
          formats={formats}
          modules={modules}
          onChange={handleChange}
          placeholder={`Type ${label}`}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
