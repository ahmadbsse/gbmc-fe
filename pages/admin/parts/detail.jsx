import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import apiClient from "@/utils/apiClient";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Navbar, BaseLoader, BaseImage, SeoHead } from "@/components/common";

const ViewPartDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const getPartDetails = async () => {
    try {
      const url = `/parts/${id}?populate=*`;
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
    if (id) getPartDetails();
  }, [id]);
  const setTab = (tab) => {
    //store tab object to local storage
    if (tab) {
      localStorage.setItem("activeTab", JSON.stringify(tab));
      router.push("/admin");
    }
  };
  return (
    <>
      <SeoHead title="Admin" />
      <div className="bg-gray-5 mt-20 min-h-screen">
        <Navbar isAdmin setTab={setTab} activeTab={"Parts"} />
        <main className="container mx-auto px-4 py-8">
          {formData ? (
            <div className="mx-auto max-w-[810px] space-y-3 lg:space-y-5">
              <h1 className="mx-auto mb-10 w-fit text-center text-2xl font-bold">
                View Part - {formData?.name || ""}
              </h1>
              <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="required mb-1 block font-medium">Name</label>
                  <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                    {formData.name}
                  </div>
                </div>
                <div className="w-full">
                  <label className="required mb-1 block font-medium">Make</label>
                  <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                    {formData.supplier.name}
                  </div>
                </div>
              </div>
              <div className="w-full text-sm">
                <label className="required mb-1 block font-medium">OEM Numbers</label>
                <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                  {formData.oem_number}
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-5">
                <div className="w-full">
                  <label className="required mb-1 block font-medium">Material</label>
                  <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                    {formData.material}
                  </div>
                </div>
                <div className="w-full">
                  <label className="required mb-1 block font-medium"> Weight</label>
                  <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                    {formData.weight}
                  </div>
                </div>
                <div className="w-full">
                  <label className="required t mb-1 block font-medium">Registered Number</label>
                  <div className="w-full rounded-lg border border-gray-300 px-2.5 py-2">
                    {formData.number}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <RichTextEditor
                  handleChange={() => {}}
                  defaultValue={formData.description}
                  disabled={true}
                />
              </div>

              <label className="required mb-1 block text-sm font-medium">Media</label>
              <div className="flex flex-wrap items-center gap-4">
                {formData?.media ? (
                  Array.isArray(formData?.media) ? (
                    formData?.media.map((item, index) => {
                      if (item && item?.formats) {
                        return (
                          <div className="h-32 w-40" key={index}>
                            <BaseImage
                              key={index}
                              width={item?.formats?.thumbnail?.width}
                              height={item?.formats?.thumbnail?.height}
                              src={item?.formats?.thumbnail?.url}
                              alt={item?.name}
                              classes="object-contain w-full h-full"
                            />
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="h-32 w-44">
                      <BaseImage
                        width={formData?.media?.formats?.thumbnail?.width}
                        height={formData?.media?.formats?.thumbnail?.height}
                        src={formData?.media?.formats?.thumbnail?.url}
                        alt={formData?.name}
                        classes="object-contain w-full h-full"
                      />
                    </div>
                  )
                ) : (
                  <div className="h-32 w-44"></div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-3">
                <div className="flex w-full items-center gap-2">
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

                <div className="flex w-full items-center gap-2">
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

export default ViewPartDetails;
