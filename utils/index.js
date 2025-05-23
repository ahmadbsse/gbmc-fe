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
      createdAt: media?.createdAt,
      formats: {
        small: {
          url: media?.formats?.small?.url,
          width: media?.formats?.small?.width || 500,
          height: media?.formats?.small?.height || 500,
        },

        thumbnail: {
          url: media?.formats?.thumbnail?.url,
          width: media?.formats?.thumbnail?.width || 156,
          height: media?.formats?.thumbnail?.height || 156,
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
  if (response.media && Array.isArray(response.media)) {
    response.media = response.media.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
      await apiClient.DELETE(`/upload/files/${id}`).then(() => {});
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

export function richTextHasOnlySpaces(html) {
  // Remove HTML tags
  const textContent = html.replace(/<[^>]*>/g, "");
  // Check if the remaining content is only whitespace
  return textContent.trim().length === 0;
}

export function sanitizeText(input) {
  if (typeof input !== "string") return input;

  return input
    .trim() // Remove leading and trailing spaces
    .replace(/</g, "&lt;") // Escape `<` to prevent XSS
    .replace(/>/g, "&gt;") // Escape `>` to prevent XSS
    .replace(/"/g, "&quot;") // Escape `"`
    .replace(/'/g, "&#39;") // Escape `'`
    .replace(/\\/g, "&#92;"); // Escape backslashes
}

export function decodeText(input) {
  if (typeof input !== "string") return input;

  return input
    .replace(/&lt;/g, "<") // Convert `&lt;` back to `<`
    .replace(/&gt;/g, ">") // Convert `&gt;` back to `>`
    .replace(/&quot;/g, '"') // Convert `&quot;` back to `"`
    .replace(/&#39;/g, "'") // Convert `&#39;` back to `'`
    .replace(/&#92;/g, "\\"); // Convert `&#92;` back to `\`
}

export const downloadFile = async (fileUrl, filename = "download.pdf") => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

export const generateAssetsUrl = (url) => {
  const isValidFullUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  let fullUrl = "";
  if (isValidFullUrl(url)) {
    fullUrl = url;
  } else {
    const result = url.replace("/uploads", "");
    fullUrl = `https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}${result}`;
  }
  return fullUrl;
};
