import React, { useState } from "react";
import { Settings, Folder, Plus, Eye, EyeOff, Star } from "lucide-react";
import Head from "next/head";

import { AdminTabs, AdminModal } from "@/components/admin";
import { adminCategories } from "@/data";
import { Navbar, BaseButton } from "@/components/common";

import { appData } from "@/constants";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [showModal, setShowModal] = useState(false);

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
        <AdminModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type="product" // or "category"
        />
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="w-fit">
              <BaseButton
                id="viewDetailsButton"
                type="submit"
                handleClick={() => {
                  setShowModal(true);
                }}
              >
                <p className="mx-auto flex w-fit px-3">
                  <Plus className="mt-0.5 h-4 w-4" />
                  Add New
                </p>
              </BaseButton>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4">
            <AdminTabs
              active={activeTab === "categories"}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </AdminTabs>
            <AdminTabs active={activeTab === "parts"} onClick={() => setActiveTab("parts")}>
              Parts
            </AdminTabs>
            <AdminTabs
              active={activeTab === "engineering"}
              onClick={() => setActiveTab("engineering")}
            >
              Engineering
            </AdminTabs>
          </div>

          {/* Content */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium">
                {activeTab === "categories" ? "Categories" : "Parts"}
              </h2>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                {adminCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Folder className="h-5 w-5" />
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <span className="text-sm">{category.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <i
                        className={`rounded-lg p-2 ${
                          category.status === "active"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100"
                        }`}
                      >
                        {category.status === "active" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </i>
                      <i
                        className={`rounded-lg p-2 ${
                          category.featured ? "bg-yellow-50 text-yellow-600" : "bg-gray-100"
                        }`}
                      >
                        <Star className="h-4 w-4" />
                      </i>
                      <i className="">
                        <Settings className="h-4 w-4" />
                      </i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
