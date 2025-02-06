import showToast from "@/utils/toast";

export const createPartValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  if (formData.supplier == "") {
    showToast(`Please enter supplier`, "error");
    return false;
  }
  if (formData.number == "") {
    showToast(`Please enter SKU`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }

  if (typeof dataFilesIds === "string" && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const editPartValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  if (formData.supplier == "") {
    showToast(`Please enter supplier`, "error");
    return false;
  }
  if (formData.number == "") {
    showToast(`Please enter SKU`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }

  if (typeof dataFilesIds === "string" && formData.media.length == 0 && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && formData.media.length == 0 && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const createSubAssemblyValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  if (formData.number == "") {
    showToast(`Please enter SKU`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (typeof dataFilesIds === "string" && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const createEngineeringComponentValidator = (formData) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (formData.media == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (formData.hero_image == "") {
    showToast(`Please upload a hero image`, "error");
    return false;
  }
  if (formData.summary == "") {
    showToast(`Please enter summary`, "error");
    return false;
  }
  return true;
};
export const editEngineeringComponentValidator = (formData) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (!formData.media || formData.media.length == 0) {
    showToast(`Please upload detail images`, "error");
    return false;
  }
  if (formData.hero_image == "") {
    showToast(`Please upload a hero image`, "error");
    return false;
  }
  if (formData.summary == "") {
    showToast(`Please enter summary`, "error");
    return false;
  }
  return true;
};
export const editSubAssemblyValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }

  if (formData.number == "") {
    showToast(`Please enter SKU`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (typeof dataFilesIds === "string" && formData.media.length == 0 && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && formData.media.length == 0 && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const addCategoryAndSupplierValidator = (formData, currentTab, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }

  if (typeof dataFilesIds === "string" && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const editCategoryAndSupplierValidator = (data, currentTab, dataFilesIds) => {
  if (data.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (data.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (typeof dataFilesIds === "string" && data.media.length == 0 && dataFilesIds == "") {
    showToast(`Please upload an image`, "error");
    return false;
  }
  if (typeof dataFilesIds === "object" && data.media.length == 0 && dataFilesIds.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
