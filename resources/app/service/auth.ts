import axios from "axios";
import authAxios from "@/service/service";
import { BASE_URL } from "./service";

export const signInWithToken = async (token:string) => {
  return await authAxios.post(BASE_URL + "/auth/signinWithToken", {token});
};


export const signIn = async (email: string, password: string) => {
  return await axios.post(BASE_URL + "/auth/signin", {
    email,
    password,
  });
};


export const forgotPassword = async (email: string) => {
  return await axios.post(BASE_URL + "/auth/forgotPassword", {
    email,
  });
};

export const resetPassword = async (enc: string, password: string, password_confirmation: string) => {
  return await axios.post(BASE_URL + "/auth/resetPassword", {
    enc,
    password,
    password_confirmation
  });
};

export const spoofing = async (email: string) => {
  return await axios.post(BASE_URL + "/admin/users/spoofing", {
    email,
  });
};

export const cancelSpoofing = async () => {
  return await axios.post(BASE_URL + "/admin/users/cancelSpoofing");
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  return await axios.post(BASE_URL + "/auth/signup", {
    name,
    email,
    password,
    password_confirmation,
  });
};
