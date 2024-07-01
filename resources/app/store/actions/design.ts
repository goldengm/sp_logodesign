import {
  saveDesign,
  listDesigns,
  deleteDesign,
  duplicateDesign,
  renameDesign,
} from "@/service/design";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setCurDesignId, setDesignList } from "@/store/reducers/design";

export const SaveDesignAction = (
  id: number,
  designName: string,
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
        data: { success, design_id, message },
      } = await saveDesign(id, designName, category, keywords, description, thumbnail, data);
      if (success) {
        dispatch(setCurDesignId(design_id));
      }
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const DeleteDesignAction = (id: number) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message },
      } = await deleteDesign(id);
      dispatch(setNotifyMsg(message));
      if (success) {
        dispatch(LoadDesignAction());
      }
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const RenameDesignAction = (id: number, designName: string) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message },
      } = await renameDesign(id, designName);
      dispatch(setNotifyMsg(message));
      if (success) {
        dispatch(LoadDesignAction());
      }
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const DuplicateDesignAction = (id: number, designName: string) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message },
      } = await duplicateDesign(id);
      dispatch(setNotifyMsg(message));
      if (success) {
        dispatch(LoadDesignAction());
      }
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const LoadDesignAction = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, designs },
      } = await listDesigns();
      dispatch(setNotifyMsg(message));
      dispatch(setDesignList(designs));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};
