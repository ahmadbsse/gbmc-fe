import { useState, useEffect } from "react";
import { X } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { BaseImage, BaseLoader } from "@/components/common";

const MakeDetailModal = ({ activeID, setShowMakeDetailModal }) => {
  const [formData, setFormData] = useState(null);

  const getMakeDetails = async () => {
    try {
      const url = `/suppliers/${activeID}?populate=*`;
      await apiClient.GET(url).then((res) => {
        const response = res.data;
        if (!Array.isArray(response.media)) {
          response.media = [response.media];
        }
        setFormData(response);
      });
    } catch (error) {
      console.error("Error fetching resource:", error.message);
    } finally {
    }
  };

  useEffect(() => {
    if (activeID) {
      getMakeDetails();
    }
  }, [activeID]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="custom-scrollbar relative max-h-[600px] w-full max-w-xl overflow-y-auto rounded-lg bg-white">
        {formData ? (
          <>
            <div className="fixed flex w-full max-w-[560px] items-center justify-between gap-5 rounded-tl-lg bg-white py-3 pl-6 pr-2">
              <h2 className="truncate text-2xl font-bold">
                View Make - <span className="font-medium">{formData?.name || ""}</span>
              </h2>
              <button onClick={() => setShowMakeDetailModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-10 space-y-3 p-6 lg:space-y-5">
              <div className="w-full text-sm">
                <label className="required mb-1 block font-medium">Name</label>
                <div
                  title={formData?.name}
                  className="w-full rounded-lg border border-gray-300 px-2.5 py-2"
                >
                  {formData?.name}
                </div>
              </div>
              <div className="basis-1/2">
                <label className="required mb-1 block text-sm font-medium">Media</label>
                <div className="flex flex-wrap items-center gap-4">
                  {formData.media ? (
                    Array.isArray(formData.media) ? (
                      formData.media.map((item, index) => {
                        if (item && item?.formats) {
                          return (
                            <div className="h-28 w-44" key={index}>
                              <BaseImage
                                key={index}
                                width={item.formats.thumbnail.width}
                                height={item.formats.thumbnail.height}
                                src={item.formats.thumbnail.url}
                                alt={item.name}
                                classes="object-contain w-full h-full"
                              />
                            </div>
                          );
                        }
                      })
                    ) : (
                      <div className="h-28 w-44">
                        <BaseImage
                          width={formData.media.formats.thumbnail.width}
                          height={formData.media.formats.thumbnail.height}
                          src={formData.media.formats.thumbnail.url}
                          alt={formData.name}
                          classes="object-contain w-full h-full"
                        />
                      </div>
                    )
                  ) : (
                    <div className="h-28 w-44"></div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    disabled
                    checked={formData?.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 outline-none focus:border-primary focus:ring-primary"
                  />
                  <label htmlFor="active" className="text-sm">
                    Mark as active
                  </label>
                </div>
              </div>
              <div className="ml-auto mt-6 flex w-fit gap-4">
                {/* <BaseButton loading={loading} type="submit">
                  Save
                </BaseButton> */}
              </div>
            </div>
          </>
        ) : (
          <p className="mx-auto w-fit">
            <BaseLoader />
          </p>
        )}
      </div>
    </div>
  );
};

export default MakeDetailModal;
