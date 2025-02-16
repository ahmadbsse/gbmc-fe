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
      name: media.name,
      formats: {
        small: media.formats?.small
          ? {
              url: media.formats.small.url,
              width: media.formats.small.width,
              height: media.formats.small.height,
            }
          : undefined,
        thumbnail: media.formats?.thumbnail
          ? {
              url: media.formats.thumbnail.url,
              width: media.formats.thumbnail.width,
              height: media.formats.thumbnail.height,
            }
          : undefined,
        actual: { url: media.url, width: media.width, height: media.height },
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
  let fileIds = null;
  const formData = new FormData();
  filesToUpload.forEach((file) => {
    formData.append("files", file.file); // Use the correct file object
  });
  if (filesToUpload.length === 0) return;
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
      await apiClient.DELETE(`/upload/files/${id}`).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.error("Error deleting resource:", error.message);
    }
  });
};
