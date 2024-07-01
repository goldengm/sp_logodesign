import axios, { BASE_URL } from "@/service/service";

export const templateList = async (data: unknown) => {
  return await axios.get(BASE_URL + "/templates/list");
};

export const saveTemplate = async (
  id: number,
  templateName: string,
  category: string,
  keywords: string,
  description: string,
  thumbnailImg: Blob | null,
  data: unknown
) => {
  const imgData = new FormData();

  imgData.append("file", thumbnailImg, "thumbnail");
  imgData.append("id", id);
  imgData.append("templateName", templateName);
  imgData.append("category", category);
  imgData.append("keywords", keywords);
  imgData.append("description", description);
  imgData.append("data", JSON.stringify(data));
  return await axios.post(BASE_URL + "/admin/templates/save", imgData);
};

export const deleteTemplate = async (id: number) => {
  return await axios.post(BASE_URL + "/admin/templates/delete", {
    id,
  });
};