/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Plus } from "lucide-react";

import { AdminTabs, AdminModal } from "@/components/admin";
import { Navbar, BaseButton } from "@/components/common";
import ListCategories from "@/components/admin/ListCategories";
import { BaseLoader } from "@/components/common";

import { appData } from "@/constants";
import apiClient from "@/utils/apiClient";

import type { Category, Categories } from "@/types";

type tab = {
  name: string;
  key: string;
};
const AdminDashboard = () => {
  const [tabs, setTabs] = useState<tab[]>([]);
  const [activeTab, setActiveTab] = useState<tab>();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Categories>(null);
  const [data, setData] = useState<Category[]>([]);

  function groupCategoryByKey(array: Category[], keyValue: string) {
    return array.filter((item) => item.type === keyValue);
  }

  const getCategories = async () => {
    try {
      setIsLoading(true);
      await apiClient.GET("/categories").then(async (res) => {
        if (res) {
          const groupedData = [
            ...new Map(
              res.data.map((item: Category) => [
                item.type,
                { name: formatName(item.type), key: item.type },
              ])
            ).values(),
          ] as tab[];

          function formatName(type: string) {
            return type
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          const groupedCategories = {};
          setTabs(groupedData);
          setActiveTab(groupedData[0]);
          groupedData.forEach((category) => {
            const key = category.key;
            groupedCategories[key] = groupCategoryByKey(res.data, key);
          });
          // @ts-expect-error Not Required
          setCategories(groupedCategories);

          setIsLoading(false);
        }
      });
    } catch (error) {
      const message = (error as Error).message;
      setIsLoading(false);
      console.error("Error in POST request:", message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    if (categories) {
      setIsLoading(true);
      setData(categories[activeTab.key]);
      setIsLoading(false);
    }
  }, [activeTab, categories]);

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
        <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} type="product" />
        <Navbar isAdmin />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="w-fit">
              <BaseButton
                loading={false}
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
          {tabs ? (
            <div className="mb-6 flex gap-4">
              {tabs.map((tab) => (
                <AdminTabs
                  key={tab.key}
                  active={activeTab.name === tab.name}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.name}
                </AdminTabs>
              ))}
            </div>
          ) : null}
          {/* Content */}
          {isLoading ? (
            <div className="mx-auto mt-10 w-fit">
              <BaseLoader width={40} height={40} />
            </div>
          ) : categories ? (
            <ListCategories categories={data} activeTab={activeTab} getCategories="getCategories" />
          ) : (
            <p className="mx-auto w-fit">No Data Found</p>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
