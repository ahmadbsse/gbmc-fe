import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";
import RichTextEditor from "@/components/common/RichTextEditor";
import { editPartValidator } from "@/utils/validators";

const EditPart = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const getPartDetails = async () => {
    try {
      const url = `/parts/${id}?populate=*`;
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
  const getSuppliers = async () => {
    try {
      const url = `/suppliers?fields=name&filters[active]=true`;
      await apiClient.GET(url).then((res) => {
        setSuppliers(res.data);
        if (res.data.length == 0) {
          showToast("Please add suppliers first", "warning");
        }
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPartValidator(formData, dataFilesIds)) {
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
      formData.supplier = formData.supplier.documentId;
      try {
        apiClient
          .PUT(`/parts/${id}`, { data: formData })
          .then(() => {
            showToast("Edited Successfully", "success");
            router.push("/admin");
          })
          .catch((error) => {
            console.log(error);
            showToast(error.message, "error");
          });
      } catch (error) {
        console.log(error);
        showToast(error.message, "error");
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
      getPartDetails();
      getSuppliers();
    }
  }, [id]);
  const handleChange = (content) => {
    setFormData({ ...formData, description: content });
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Edit Part</h1>
          {formData ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-[810px] space-y-3">
              <div className="flex flex-col md:flex-row md:gap-4">
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter name`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">
                    Registered Number
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter number`}
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="required mb-1 block text-sm font-medium">OEM Numbers</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Enter comma seperated numbers...`}
                  value={formData.oem_number}
                  onChange={(e) => setFormData({ ...formData, oem_number: e.target.value })}
                />
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">Material</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter material name`}
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium"> Weight</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter weight`}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <label className="required mb-1 block text-sm font-medium">Supplier</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    value={JSON.stringify(formData.supplier.name)}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        supplier: JSON.parse(e.target.value), // Assign only documentId here
                      });
                    }}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={JSON.stringify(supplier.documentId)}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <RichTextEditor handleChange={handleChange} defaultValue={formData.description} />

              <label className="required mb-1 block text-sm font-medium"> Media</label>
              <BaseFileUploader setDataFilesIds={setDataFilesIds} multiple={true} />
              <div className="flex items-center gap-4">
                {formData?.media?.map((item) => (
                  <div className="relative h-32 w-44" key={item.documentId}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deletePreviousImage(item.id);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-solidGray/40 p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                    <BaseImage
                      width={item.formats?.thumbnail?.width}
                      height={item.formats?.thumbnail?.height}
                      src={item.formats?.thumbnail?.url}
                      alt={item.name}
                      classes="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-3">
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
              <div className="mx-auto w-[300px] py-4">
                <BaseButton loading={false} type="submit">
                  Save
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

export default EditPart;
