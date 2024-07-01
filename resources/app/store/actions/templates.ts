import { saveTemplate } from "@/service/templates";
import { deleteTemplate } from "@/service/templates";
import { templateList } from "@/service/templates";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setTemplates } from "@/store/reducers/templates";

export const LoadTemplateListAction = (data: unknown) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, templates, message },
      } = await templateList(data);
      dispatch(setTemplates(templates));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};


export const SaveTemplateAction = (
  id: number,
  templateName: string,
  category: string,
  keywords: string,
  description: string,
  thumbnail: Blob | null,
  data: unknown
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, template_id, message },
      } = await saveTemplate(id, templateName, category, keywords, description, thumbnail, data);
      if (success) {
        // dispatch(setCurTemplateId(template_id));
      }
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const DeleteTemplateAction = (id: number) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message },
      } = await deleteTemplate(id);
      dispatch(setNotifyMsg(message));
      if (success) {
        // dispatch(LoadTemplateListAction());
      }
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};