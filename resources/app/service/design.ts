import axios, { BASE_URL } from "@/service/service";

export const saveDesign = async (
  id: number,
  designName: string,
  category: string,
  keywords: string,
  description: string,
  thumbnailImg: Blob | null,
  data: unknown
) => {
  const imgData = new FormData();

  imgData.append("file", thumbnailImg, "thumbnail");
  imgData.append("id", id);
  imgData.append("designName", designName);
  imgData.append("category", category);
  imgData.append("keywords", keywords);
  imgData.append("description", description);
  imgData.append("data", JSON.stringify(data));
  return await axios.post(BASE_URL + "/design/save", imgData);
};

export const deleteDesign = async (id: number) => {
  return await axios.post(BASE_URL + "/design/delete", {
    id,
  });
};

export const renameDesign = async (id: number, designName: string) => {
  return await axios.post(BASE_URL + "/design/rename", {
    id,
    designName,
  });
};

export const duplicateDesign = async (id: number) => {
  return await axios.post(BASE_URL + "/design/duplicate", {
    id,
  });
};

export const listDesigns = async () => {
  return await axios.get(BASE_URL + "/design/list");
};
