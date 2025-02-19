import apiClient from "@/utils/apiClient";
export function convertToReadableDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "long", // e.g., "Monday"
    year: "numeric", // e.g., "2025"
    month: "long", // e.g., "January"
    day: "numeric", // e.g., "18"
    hour: "2-digit", // e.g., "8 PM"
    minute: "2-digit", // e.g., "09"
    second: "2-digit", // e.g., "13"
    hour12: true, // For 12-hour format; set to false for 24-hour format
  });
}

export function transformMedia(response) {
  const transform = (item) => {
    if (!item.media) return;

    const transformMediaObject = (media) => ({
      type: "image",
      id: media?.id,
      documentId: media?.documentId,
      name: media?.name,
      formats: {
        small: media?.formats?.small
          ? {
              url: media?.formats?.small?.url,
              width: media?.formats?.small?.width || 500,
              height: media?.formats?.small?.height || 500,
            }
          : {
              url: "/placeholder.com/500",
              width: 500,
              height: 500,
            },
        thumbnail: media?.formats?.thumbnail
          ? {
              url: media?.formats?.thumbnail?.url,
              width: media?.formats?.thumbnail?.width || 156,
              height: media?.formats?.thumbnail?.height || 156,
            }
          : {
              url: "/placeholder.com/156",
              width: 156,
              height: 156,
            },
        actual: { url: media.url, width: media.width || 1080, height: media.height || 1080 },
      },
    });

    // Check if media is an array or a single object
    if (Array.isArray(item.media)) {
      item.media = item.media.map(transformMediaObject);
    } else {
      item.media = transformMediaObject(item.media);
    }
  };

  if (Array.isArray(response)) {
    response.forEach((item) => {
      transform(item);
    });
  } else {
    const arr = [response];
    arr.forEach((item) => {
      transform(item);
    });
  }
  return response;
}

export function transformHeroVideo(hero_image) {
  return {
    type: "video",
    id: hero_image.id,
    name: hero_image.name,
    documentId: hero_image.documentId,
    url: hero_image.url,
    width: hero_image.width,
    height: hero_image.height,
  };
}

export const uploadFilesRequest = async (filesToUpload, multiple = true) => {
  if (filesToUpload.length === 0) return;
  const newFiles = filesToUpload.filter((file) => file.file);
  if (newFiles.length === 0) return;
  let fileIds = null;
  const formData = new FormData();
  filesToUpload.forEach((file) => {
    formData.append("files", file.file); // Use the correct file object
  });
  const url = "/upload";
  try {
    await apiClient.UPLOAD(url, formData).then((response) => {
      if (response) {
        if (multiple) {
          fileIds = response.map((file) => file.id);
        } else {
          fileIds = response[0].id;
        }
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    return fileIds;
  }
};
export const deleteFilesRequest = async (fileIds) => {
  fileIds.forEach(async (id) => {
    try {
      await apiClient.DELETE(`/upload/files/${id}`).then(() => {
        console.log("File removed successfully");
      });
    } catch (error) {
      console.error("Error deleting resource:", error.message);
    }
  });
};

export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // Check for reference equality

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return false; // If either is not an object or null, they are not equal
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Different number of keys

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false; // Key mismatch or recursive value mismatch
    }
  }

  return true;
}
