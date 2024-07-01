import { useAppDispatch } from "@/store/hooks";
import { setResponse } from "@/store/reducers/auth";
import { useLocation, Navigate } from "react-router-dom";
import { useAsync } from "react-use";
import { useAppSelector } from "@/store/hooks";
import { signInWithToken } from "@/service/auth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const dispatch = useAppDispatch();

  useAsync(async () => {
    if (localStorage.getItem("userToken")) {
      const res = await signInWithToken(localStorage.getItem("userToken"));
      if (res.data.success) {
        dispatch(setResponse({ bSuccess: true, authUser: res.data.user }));
      } else {
        localStorage.removeItem("userToken");
        dispatch(setResponse({ bSuccess: false }));
      }
    }
  }, []);

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
