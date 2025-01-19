import React, { useEffect, useState } from "react";
import Head from "next/head";

import { Navbar } from "@/components/common";

import { BaseButton } from "@/components/common";
import { BaseFileUploader } from "@/components/admin";
import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";
import { categoryTypeOptions } from "@/data";

const CreatePart = () => {
  const initialFormData = {
    name: "",
    number: "",
    material: "",
    weight: "",
    supplier: "", //string or id
    description: "",
    type: "",
    active: false,
    featured: false,
    media: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [dataFilesIds, setDataFilesIds] = useState([]);
  const validateForm = () => {
    if (formData.name == "") {
      setError(`Please enter part name`);
      return false;
    }
    if (formData.description == "") {
      setError(`Please enter part description`);
      return false;
    }
    if (formData.type == "") {
      setError(`Please select part type`);
      return false;
    }
    if (typeof dataFilesIds === "string" && dataFilesIds == "") {
      setError(`Please upload an image`);
      return false;
    }
    if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
      setError(`Please upload an image`);
      return false;
    }
    delete formData.featured;
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      formData.media = dataFilesIds;
    }
  };
  return (
    <>
      <Head>
        <title>{`${appData.name} - Admin`}</title>
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
          <h1 className="mx-auto mb-8 w-fit text-2xl font-bold">Add New Part</h1>
          <form onSubmit={handleSubmit} className="mx-auto max-w-[1000px] space-y-3">
            <div className="flex flex-col lg:flex-row lg:gap-4">
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

            <div className="flex flex-col lg:flex-row lg:gap-4">
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
                  value={JSON.stringify(formData.type)}
                  onChange={(e) => setFormData({ ...formData, type: JSON.parse(e.target.value) })}
                >
                  <option value="">Select a supplier</option>
                  {categoryTypeOptions.map((option) => (
                    <option key={option.value} value={JSON.stringify(option.value)}>
                      {option.label}
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
                placeholder={`Enter ${formData.type} description`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:border-transparent focus:ring-1 focus:ring-primary"
                  value={JSON.stringify(formData.type)}
                  onChange={(e) => setFormData({ ...formData, type: JSON.parse(e.target.value) })}
                >
                  <option value="">Select a category</option>
                  {categoryTypeOptions.map((option) => (
                    <option key={option.value} value={JSON.stringify(option.value)}>
                      {option.label}
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
            <BaseFileUploader setDataFilesIds={setDataFilesIds} />
            <p className="mx-auto w-fit text-sm capitalize text-error">{error}</p>

            <div className="mx-auto w-[300px]">
              <BaseButton loading={false} type="submit">
                Add Part
              </BaseButton>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};
export default CreatePart;
