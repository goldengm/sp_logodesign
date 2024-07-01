import { signIn, signUp, signInWithToken } from "@/service/auth";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setResponse } from "@/store/reducers/auth";
import { spoofing, cancelSpoofing } from "@/service/auth";

export const SignInWithTokenAction = () => {
  return async (dispatch) => {
    try {
      const {
        data: { success, message, token, user },
      } = await signInWithToken(localStorage.getItem("userToken"));
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
  };
};

export const SignInAction = (username: string, password: string) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token, user },
      } = await signIn(username, password);
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const SpoofingAction = (email: string, navigate: any) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token, user },
      } = await spoofing(email);
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
      if(success) navigate("/user")

    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const CancelSpoofingAction = (navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token, user },
      } = await cancelSpoofing();
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
      if(success) navigate("/admin/users")

    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};


export const SignOutAction = () => {
  return async (dispatch) => {
    localStorage.removeItem("userToken");
    dispatch(setResponse({success: false}));
  };
};

export const SignUpAction = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
  navigate: any
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, message, token, user },
      } = await signUp(name, email, password, password_confirmation);
      localStorage.setItem("userToken", token);
      dispatch(setResponse({bSuccess: success, authUser: user}));
      dispatch(setNotifyMsg(message));
      if(success) navigate("/admin/users")

    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};

export const ResetPassword = (password: string,
  password_confirmation: string) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const {
          data: { message, success },
        } = await signUp(name, email, password, password_confirmation);
  
        dispatch(setNotifyMsg(message));
        if(success) navigate("/signin")
      } catch (e) {
        dispatch(setNotifyMsg(e.message));
      }
      dispatch(setLoading(false));
    };
}
