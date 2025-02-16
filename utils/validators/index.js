import showToast from "@/utils/toast";

export const createPartValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.number == "") {
    showToast(`Please enter registration number`, "error");
    return false;
  }
  if (formData.oem_number == "") {
    showToast(`Please enter oem numbers`, "error");
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
  if (formData.number == "") {
    showToast(`Please enter registration number`, "error");
    return false;
  }
  if (formData.oem_number == "") {
    showToast(`Please enter oem numbers`, "error");
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
  if (formData.number == "") {
    showToast(`Please enter registration number`, "error");
    return false;
  }

  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  if (formData.oem_number == "") {
    showToast(`Please enter oem numbers`, "error");
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
export const editSubAssemblyValidator = (formData, dataFilesIds) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.number == "") {
    showToast(`Please enter registration number`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  if (formData.oem_number == "") {
    showToast(`Please enter oem numbers`, "error");
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
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
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
  if (formData.material == "") {
    showToast(`Please enter material`, "error");
    return false;
  }
  if (formData.weight == "") {
    showToast(`Please enter weight`, "error");
    return false;
  }
  return true;
};
export const makeValidator = (formData) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.media == "" || data.media.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
