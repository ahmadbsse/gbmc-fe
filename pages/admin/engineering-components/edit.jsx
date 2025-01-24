import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import { editEngineeringComponentValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const EditComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);

  const getComponentDetails = async () => {
    try {
      const url = `/engineering-components/${id}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = transformMedia(res.data);
        delete response.id;
        delete response.updatedAt;
        delete response.createdAt;
        delete response.publishedAt;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEngineeringComponentValidator(formData, dataFilesIds)) {
      if (dataFilesIds.length === 0) {
        if (Array.isArray(formData.media)) {
          formData.media = formData.media.map((item) => item.id);
        } else {
          formData.media = formData.media.id;
        }
      } else {
        formData.media = [...formData.media.map((item) => item.id), ...dataFilesIds];
      }
      delete formData.documentId;
      try {
        apiClient
          .PUT(`/engineering-components/${id}`, { data: formData })
          .then(() => {
            showToast("Editted Successfully", "success");
            router.push("/admin");
          })
          .catch((error) => {
            showToast(error.message, "error");
            console.log(error);
          });
      } catch (error) {
        showToast(error.message, "error");
        console.log(error);
      }
    }
  };
  const deletePreviousImage = async (id) => {
    try {
      await apiClient.DELETE(`/upload/files/${id}`).then((res) => {
        const newData = removeMediaById(id);
        setFormData(newData);
      });
    } catch (error) {
      console.error("Error deleting resource:", error.message);
    }
  };
  function removeMediaById(idToRemove) {
    return {
      ...formData,
      media: formData?.media?.filter((mediaItem) => mediaItem.id !== idToRemove),
    };
  }
  useEffect(() => {
    if (id) {
      getComponentDetails();
    }
  }, [id]);
  const handleChangeDescription = (content) => {
    setFormData({ ...formData, description: content });
  };
  const handleChangeSummary = (content) => {
    setFormData({ ...formData, summary: content });
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Edit Component</h1>
          {formData ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-[1000px] space-y-3">
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Enter name`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <RichTextEditor
                handleChange={handleChangeSummary}
                defaultValue={formData.summary}
                label="summary"
              />
              <RichTextEditor
                handleChange={handleChangeDescription}
                defaultValue={formData.description}
              />

              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                  />
                  <label htmlFor="active" className="text-sm">
                    Mark as active
                  </label>
                </div>

                <div className="flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </label>
                </div>
              </div>
              <BaseFileUploader setDataFilesIds={setDataFilesIds} multiple={true} />
              <div className="flex items-center gap-4">
                {formData?.media?.map((item) => (
                  <div className="relative w-44" key={item.documentId}>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        deletePreviousImage(item.id);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                    <BaseImage
                      width={item.formats.thumbnail.width}
                      height={item.formats.thumbnail.height}
                      src={item.formats.thumbnail.url}
                      alt={item.name}
                    />
                  </div>
                ))}
              </div>

              <div className="mx-auto w-[300px]">
                <BaseButton loading={false} type="submit">
                  Edit Component
                </BaseButton>
              </div>
            </form>
          ) : (
            <p className="mx-auto w-fit">
              <BaseLoader />
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default EditComponent;
