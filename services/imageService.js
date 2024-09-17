import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require('../assets/images/defaultUser.jpeg');
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `https://svimohygwiufcyovtjvh.supabase.co/storage/v1/object/public/uploads/${filePath}`,
    };
  }

  return null;
};

export const uploadFile = async (folderName, fileUri, isImage) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64); // array buffer

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        contentType: isImage ? "image/*" : "video/*",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log("File upload error : ", error);
      return { success: false, msg: "Could not upload media!" };
    }

    return { success: true, data: data.path };
  } catch (error) {
    console.log("File upload error : ", error);
    return { success: false, msg: "Could not upload media!" };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const getLocalFilePath = (filePath) => {
  const fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const downloadFile = async (url) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};
