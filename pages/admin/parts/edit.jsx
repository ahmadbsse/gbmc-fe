import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import apiClient from "@/utils/apiClient";
import { transformMedia } from "@/utils";
import { Navbar, BaseLoader, BaseImage, BaseButton } from "@/components/common";
import BaseFileUploader from "@/components/admin/BaseFileUploader";
import showToast from "@/utils/toast";

const EditPart = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [dataFilesIds, setDataFilesIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
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
      const url = `/suppliers?fields=name`;
      await apiClient.GET(url).then((res) => {
        const data = res.data.map((item) => item.name);
        setSuppliers(data);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  const getCategories = async () => {
    try {
      const url = `/categories?fields=name`;
      await apiClient.GET(url).then((res) => {
        const data = res.data.map((item) => item.name);
        setCategories(data);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };
  const validateForm = () => {
    if (formData.name == "") {
      setError(`Please enter part name`);
      return false;
    }
    if (formData.material == "") {
      setError(`Please enter part material`);
      return false;
    }
    if (formData.weight == "") {
      setError(`Please enter part weight`);
      return false;
    }
    if (formData.supplier == "") {
      setError(`Please enter part supplier`);
      return false;
    }
    if (formData.number == "") {
      setError(`Please enter part SKU`);
      return false;
    }
    if (formData.description == "") {
      setError(`Please enter part description`);
      return false;
    }
    if (formData.category == "") {
      setError(`Please select part category`);
      return false;
    }

    if (typeof dataFilesIds === "string" && formData.media.length == 0 && dataFilesIds == "") {
      setError(`Please upload an image`);
      return false;
    }
    if (
      typeof dataFilesIds === "object" &&
      formData.media.length == 0 &&
      dataFilesIds.length == 0
    ) {
      setError(`Please upload an image`);
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
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
      getCategories();
    }
  }, [id]);
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Edit Part</h1>
          {formData ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-[1000px] space-y-3">
              <div className="flex flex-col md:flex-row md:gap-4">
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
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">SKU Number</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter number`}
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-4">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Material</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter material name`}
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium"> Weight</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    placeholder={`Enter weight`}
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Supplier</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  placeholder={`Enter description`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex w-full items-center gap-2">
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

                <div className="mt-4 flex w-full items-center gap-2">
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
              <p className="mx-auto w-fit text-sm capitalize text-error">{error}</p>

              <div className="mx-auto w-[300px]">
                <BaseButton loading={false} type="submit">
                  Edit Part
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
