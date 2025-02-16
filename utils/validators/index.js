import showToast from "@/utils/toast";

export const makeValidator = (formData) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.media == "" || formData.media.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const partValidator = (formData) => {
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
  if (formData.media.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};
export const subAssemblyValidator = (formData) => {
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
  if (formData.media.length == 0) {
    showToast(`Please upload an image`, "error");
    return false;
  }
  return true;
};

export const engineeringComponentValidator = (formData) => {
  if (formData.name == "") {
    showToast(`Please enter name`, "error");
    return false;
  }
  if (formData.description == "") {
    showToast(`Please enter description`, "error");
    return false;
  }
  if (!formData.media || formData.media.length == 0 || formData.media == "") {
    showToast(`Please upload detail images`, "error");
    return false;
  }
  if (formData.hero_image == "" || formData.hero_image.length == 0) {
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
