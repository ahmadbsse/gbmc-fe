import { Folder, Eye, EyeOff, Star, Pencil, Trash } from "lucide-react";
import apiClient from "@/utils/apiClient";

const ListCategories = ({ categories, activeTab, getCategories }) => {
  const toggleActivation = async (category) => {
    try {
      const url = `/categories/${category.id}`; // API endpoint where the PUT request is sent
      const data = JSON.parse(JSON.stringify(category));
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      data.active = !data.active;

      await apiClient.PUT(url, { data: data }).then((res) => {
        getCategories();
        console.log("Resource updated successfully:", res);
      });
    } catch (error) {
      console.error("Error updating resource:", error.message);
    }
  };
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium">{activeTab.name}</h2>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {categories.map((category) => (
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
                  onClick={() => toggleActivation(category)}
                  className={`rounded-lg p-2 ${
                    category.active
                      ? "bg-green-50 text-green-600 hover:bg-yellow-50"
                      : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                  }`}
                >
                  {category.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </i>
                <i
                  className={`rounded-lg p-2 ${
                    category.featured
                      ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                      : "bg-gray-100 hover:bg-yellow-50 hover:text-yellow-600"
                  }`}
                >
                  <Star className="h-4 w-4" />
                </i>
                <i
                  className={`rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600`}
                >
                  <Pencil className="h-4 w-4" />
                </i>
                <i className="rounded-lg bg-gray-100 p-2 hover:bg-yellow-50 hover:text-yellow-600">
                  <Trash className="h-4 w-4" />
                </i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCategories;
