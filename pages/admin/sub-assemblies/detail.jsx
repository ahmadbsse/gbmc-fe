import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import apiClient from "@/utils/apiClient";

import { Navbar, BaseLoader, BaseImage } from "@/components/common";
import RichTextEditor from "../../../components/common/RichTextEditor";

const ViewSubAssemblyDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const getSubAssemblyDetails = async () => {
    try {
      const url = `/sub-assemblies/${id}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = res.data;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    }
  };

  useEffect(() => {
    if (id) getSubAssemblyDetails();
  }, [id]);
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <div className="mx-auto max-w-[1000px] space-y-3">
              <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Sub Assembly - Details</h1>
              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.name}
                  </div>
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">SKU Number</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.number}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium">Material</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.material}
                  </div>
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium"> Weight</label>
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-2">
                    {formData.weight}
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <div
                  className="product-description text-justify"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>

              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="mt-4 flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    disabled
                    onChange={() => {}}
                    className="rounded border-gray-300 outline-none focus:border-primary"
                  />
                  <label htmlFor="active" className="text-sm">
                    Mark as active
                  </label>
                </div>

                <div className="mt-4 flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    disabled
                    onChange={() => {}}
                    checked={formData.featured}
                    className="rounded border-gray-300 outline-none focus:border-primary"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </label>
                </div>
              </div>
              <label className="mb-1 block text-sm font-medium">Media</label>
              <div className="flex flex-wrap items-center gap-4">
                {Array.isArray(formData.media) ? (
                  formData.media.map((item, index) => (
                    <div className="max-w-44" key={index}>
                      <BaseImage
                        key={index} // Add a unique key for each item
                        width={item.formats.thumbnail.width}
                        height={item.formats.thumbnail.height}
                        src={item.formats.thumbnail.url}
                        alt={item.name}
                      />
                    </div>
                  ))
                ) : (
                  <div className="max-w-44">
                    <BaseImage
                      width={formData.media.formats.thumbnail.width}
                      height={formData.media.formats.thumbnail.height}
                      src={formData.media.formats.thumbnail.url}
                      alt={formData.name}
                    />
                  </div>
                )}
              </div>
            </div>
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

export default ViewSubAssemblyDetails;
