import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Navbar } from "@/components/common";

import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";
import showToast from "@/utils/toast";
import { createSubAssemblyValidator } from "@/utils/validators";
import RichTextEditor from "@/components/common/RichTextEditor";

const CreateSubAssembly = () => {
  const router = useRouter();
  const initialFormData = {
    name: "",
    number: "",
    material: "",
    weight: "",
    description: "",
    active: false,
    featured: false,
    media: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [dataFilesIds, setDataFilesIds] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (createSubAssemblyValidator(formData, dataFilesIds)) {
      formData.media = dataFilesIds;
      try {
        apiClient
          .POST(`/sub-assemblies`, { data: formData })
          .then(() => {
            setFormData(initialFormData);
            showToast("Created Successfully", "success");
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

  const handleChange = (content) => {
    setFormData({ ...formData, description: content });
  };
  return (
    <>
      <Head>
        <title>Admin | {appData.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Platform where you get tractor related parts in one place"
        />
        <meta
          name="og:description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Platform where you get tractor related parts in one place"
        />
        <meta name="keywords" content="tractor,spare parts,machinary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Create Sub Assembly</h1>

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
                <label className="required mb-1 block text-sm font-medium">SKU Number</label>
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
            </div>

            <RichTextEditor handleChange={handleChange} defaultValue={formData.description} />

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
            <div className="mx-auto max-w-2xl">
              <label className="required mb-1 block text-sm font-medium"> Media</label>
            </div>
            <BaseFileUploader setDataFilesIds={setDataFilesIds} multiple={true} />

            <div className="mx-auto w-[300px]">
              <BaseButton loading={false} type="submit">
                save
              </BaseButton>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};
export default CreateSubAssembly;
