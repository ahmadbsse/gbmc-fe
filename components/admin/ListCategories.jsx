import { Settings, Folder, Eye, EyeOff, Star } from "lucide-react";
const ListCategories = ({ categories, activeTab }) => {
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
                {/* <i
                  className={`rounded-lg p-2 ${
                    category.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100"
                  }`}
                >
                  {category.status === "active" ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </i> */}
                {/* <i
                  className={`rounded-lg p-2 ${
                    category.featured ? "bg-yellow-50 text-yellow-600" : "bg-gray-100"
                  }`}
                >
                  <Star className="h-4 w-4" />
                </i>
                <i className="">
                  <Settings className="h-4 w-4" />
                </i> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCategories;
